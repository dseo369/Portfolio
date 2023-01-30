#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>

/* Error function used for reporting issues */
void error(const char *msg)
{
	perror(msg);
	exit(1);
}

/* Set up the address struct for the server socket */
void setupAddressStruct(struct sockaddr_in *address,
						int portNumber)
{

	/* Clear out the address struct */
	memset((char *)address, '\0', sizeof(*address));

	/* The address should be network capable */
	address->sin_family = AF_INET;
	/* Store the port number */
	address->sin_port = htons(portNumber);
	/* Allow a client at any address to connect to this server */
	address->sin_addr.s_addr = INADDR_ANY;
}

int charToInt(char c)
{
	if (c == ' ')
	{
		return 26;
	}
	return (c - 'A');
}

char intToChar(int i)
{
	if (i == 26)
	{
		return ' ';
	}
	return (i + 'A');
}

/* Assumes message is okay to be overwritten (expected empty) */
void decrypt(char *message, char *key)
{
	int i;
	for (i = 0; message[i] != '\n'; i++)
	{
		char n = (charToInt(message[i]) - charToInt(key[i]) + 27) % 27;
		message[i] = intToChar(n);
	}
	message[i] = '\0';
}

void sendACK(int connectionSocket)
{
	char ACKBuffer[20];
	memset(ACKBuffer, '\0', 20);
	strcat(ACKBuffer, "ACK");
	send(connectionSocket, ACKBuffer, strlen(ACKBuffer), 0);
}

void receiveData(char *payload, int connectionSocket)
{
	char pBuff[6];
	memset(pBuff, '\0', 6);
	/* First recv() should be payload size */
	int charsRead = recv(connectionSocket, pBuff, 5, 0);
	if (charsRead < 0)
	{
		perror("enc_server");
	}
	else
	{
		/* Sending ACK to client */
		sendACK(connectionSocket);
	}
	int currByte, payloadSize;
	payloadSize = atoi(pBuff);
	currByte = 0;

	/* retrieve payload */
	char buffer[1024];
	memset(buffer, '\0', 1024);
	memset(payload, '\0', 71000);
	while (currByte < payloadSize)
	{
		memset(buffer, '\0', 1024);
		int chars = recv(connectionSocket, buffer, 1024, 0);
		if (chars < 0)
		{
			perror("ERROR retrieving payload");
		}
		else
		{
			currByte += chars;
			sendACK(connectionSocket);
		}
		strcat(payload, buffer);
	}
}

/* Assumes buffer passed in is ready to be sent */
void sendall(char *payload, int socketFD)
{
	/* Send TOTAL payload size */
	char buffer[1024];
	char ACKBuffer[20];
	memset(ACKBuffer, '\0', 20);
	memset(buffer, '\0', 1024);
	int currByte = 0;
	char payloadSize[6];
	memset(payloadSize, '\0', 6);
	sprintf(payloadSize, "%5d", (int)strlen(payload));

	/* recv ACK (stops program and waits for data) */
	send(socketFD, payloadSize, 5, 0);
	recv(socketFD, ACKBuffer, sizeof(ACKBuffer) - 1, 0);

	/* Start sending data and receiving ACKs while there's still data to send */
	while (currByte < atoi(payloadSize))
	{
		/* Transfer data from payload buffer (large) to payload buffer (small) */
		memset(buffer, '\0', 1024);
		int i;
		for (i = 0; i < 1023; i++)
		{
			if (payload[currByte + i] == '\0')
			{
				break;
			}
			buffer[i] = payload[currByte + i];
		}
		buffer[i] = '\0';

		/* Send payload buffer now that it's ready */
		send(socketFD, buffer, sizeof(buffer) - 1, 0);

		/* Await ACK from server */
		memset(ACKBuffer, '\0', 20);
		recv(socketFD, ACKBuffer, 20, 0);
		if (strcmp(ACKBuffer, "ACK") == 0)
		{
			currByte += i;
		}
	}
}

int main(int argc, char *argv[])
{
	int connectionSocket, charsRead;
	struct sockaddr_in serverAddress, clientAddress;
	socklen_t sizeOfClientInfo = sizeof(clientAddress);

	/* Check usage & args */
	if (argc < 2)
	{
		fprintf(stderr, "USAGE: %s port\n", argv[0]);
		exit(1);
	}

	/* Create the socket that will listen for connections */
	int listenSocket = socket(AF_INET, SOCK_STREAM, 0);
	if (listenSocket < 0)
	{
		error("ERROR opening socket");
	}

	/* Set up the address struct for the server socket */
	setupAddressStruct(&serverAddress, atoi(argv[1]));

	/* Associate the socket to the port */
	if (bind(listenSocket,
			 (struct sockaddr *)&serverAddress,
			 sizeof(serverAddress)) < 0)
	{
		error("ERROR on binding");
	}

	/* Start listening for connetions. Allow up to 5 connections to queue up */
	listen(listenSocket, 5);

	/* Accept a connection, blocking if one is not available until one connects */
	while (1)
	{
		/* Open the socket */
		connectionSocket = accept(listenSocket,
								  (struct sockaddr *)&clientAddress,
								  &sizeOfClientInfo);
		if (connectionSocket < 0)
		{
			error("ERROR on accept");
		}

		/* Accept the connection request which creates a connection socket */
		int pid = fork();
		switch (pid)
		{
		case -1:
		{
			error("ERROR Creating Fork");
			break;
		}
		case 0:
		{
			/* Ensure enc is only connecting to enc_server */
			char correctClient[4];
			memset(correctClient, '\0', 4);
			charsRead = recv(connectionSocket, correctClient, 3, 0);
			if (charsRead < 0)
			{
				error("Error reading from socket");
			}
			if (strcmp(correctClient, "dec"))
			{
				char closingMsg[6];
				memset(closingMsg, '\0', 6);
				strcat(closingMsg, "close");
				charsRead = send(connectionSocket, closingMsg, 5, 0);
				close(connectionSocket);
				perror("wrongful connection\n");
				exit(2);
			}
			else
			{
				char closingMsg[6];
				memset(closingMsg, '\0', 6);
				strcat(closingMsg, "open!");
				charsRead = send(connectionSocket, closingMsg, 5, 0);
			}

			/* Receive key from client */
			char key[71000];
			memset(key, '\0', 71000);
			receiveData(key, connectionSocket);

			/* Receive message from client */
			char message[71000];
			memset(message, '\0', 71000);
			receiveData(message, connectionSocket);

			/* Decrypt message from client and store it in same buffer */
			decrypt(message, key);

			/* Send back decrypted message */
			sendall(message, connectionSocket);

			/* Close the connection socket for this client */
			close(connectionSocket);
			exit(0);
		}
		default:
		{
			break;
		}
		}
	}
	/* Close the listening socket */
	close(listenSocket);
	return 0;
}