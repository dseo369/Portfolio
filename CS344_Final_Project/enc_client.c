#include <stdio.h>
#include <stdlib.h>
#include <unistd.h> /* { close } */
#include <string.h>
#include <sys/types.h>	/* { ssize_t } */
#include <sys/socket.h> /* { send,recv } */
#include <netdb.h>		/* { gethostbyname } */
#include <fcntl.h>		/* { open } */

/* Error function used for reporting issues */
void error(char *msg)
{
	perror(msg);
	exit(1);
}

int numdigits(int n)
{
	int count = 0;
	while (n > 0)
	{
		count++;
		n = n / 10;
	}
	return count;
}

int getCharCount(char *fn)
{
	int c;
	int count = 0;
	FILE *fp = fopen(fn, "r");
	if (fp == NULL)
	{
		perror(fn), exit(1);
	}

	while (1)
	{
		c = fgetc(fp);

		if (c == EOF || c == '\n')
			break;
		if (!('A' <= c && c <= 'Z') && c != ' ')
		{
			error("File contains bad characters!\n");
			fclose(fp);
			exit(0);
		}
		count++;
	}

	fclose(fp);
	return count;
}

void readFile(char *fileContents, char *fn)
{
	FILE *fp;
	/* argv[1] is the plaintext filename */
	fp = fopen(fn, "r");
	if (fp == NULL)
	{
		perror(fn), exit(1);
	}
	fseek(fp, 0, SEEK_END);
	int fSize = ftell(fp);
	rewind(fp);
	fread(fileContents, 1, fSize, fp);
	fclose(fp);
}

/* Set up the address struct */
void setupAddressStruct(struct sockaddr_in *address,
						int portNumber,
						char *hostname)
{

	/* Clear out the address struct */
	memset((char *)address, '\0', sizeof(*address));

	/* The address should be network capable */
	address->sin_family = AF_INET;
	/* Store the port number */
	address->sin_port = htons(portNumber);

	/* Get the DNS entry for this host name */
	struct hostent *hostInfo;
	hostInfo = gethostbyname(hostname);
	if (hostInfo == NULL)
	{
		fprintf(stderr, "CLIENT: ERROR, no such host\n");
		exit(0);
	}
	/* Copy the first IP address from the DNS entry to sin_addr.s_addr */
	memcpy((char *)&address->sin_addr.s_addr,
		   hostInfo->h_addr_list[0],
		   hostInfo->h_length);
}

void sendACK(int connectionSocket)
{
	char ACKBuffer[20];
	memset(ACKBuffer, '\0', 20);
	strcat(ACKBuffer, "ACK");
	send(connectionSocket, ACKBuffer, strlen(ACKBuffer), 0);
}

void sendallFromFile(char *fn, int socketFD)
{
	/* Prepare fileContents buffer and fill it */
	char fileContents[71000];
	int fileLen;
	memset(fileContents, '\0', 71000);
	readFile(fileContents, fn);
	fileLen = strlen(fileContents);

	/* Send TOTAL payload size */
	char buffer[1024];
	char ACKBuffer[20];
	memset(ACKBuffer, '\0', 20);
	memset(buffer, '\0', 1024);
	int currByte = 0;
	char payloadSize[6];
	memset(payloadSize, '\0', 6);
	/*myitoa(fileLen, payloadSize, 10);*/
	sprintf(payloadSize, "%5d", fileLen);

	/* recv ACK (stops program and waits for data) */
	send(socketFD, payloadSize, 5, 0);
	recv(socketFD, ACKBuffer, sizeof(ACKBuffer) - 1, 0);

	/* Start sending data and receiving ACKs while there's still data to send */
	while (currByte < fileLen)
	{
		/* Transfer data from fileContents buffer (large) to payload buffer (small) */
		memset(buffer, '\0', 1024);
		int i;
		for (i = 0; i < 1023; i++)
		{
			if (fileContents[currByte + i] == '\0')
			{
				break;
			}
			buffer[i] = fileContents[currByte + i];
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

int main(int argc, char *argv[])
{
	struct sockaddr_in serverAddress;
	/* Check usage & args */
	if (argc < 4)
	{
		fprintf(stderr, "USAGE: %s plaintext key port\n", argv[0]);
		exit(0);
	}
	char *plainTextFile = argv[1];
	char *keyTextFile = argv[2];

	/* Create a socket (internet socket, TCP connection, auto-protocol) */
	int socketFD = socket(AF_INET, SOCK_STREAM, 0);
	if (socketFD < 0)
	{
		error("CLIENT: ERROR opening socket");
	}
	int y = 1;
	/* Make socket reusable */
	setsockopt(socketFD, SOL_SOCKET, SO_REUSEADDR, &y, sizeof(int));

	/* Set up the server address struct (struct, port, hostname) */
	setupAddressStruct(&serverAddress, atoi(argv[3]), "127.0.0.1");

	/* Connect to server */
	if (connect(socketFD, (struct sockaddr *)&serverAddress, sizeof(serverAddress)) < 0)
	{
		error("Error connecting");
	}

	/* let client know this is enc client */
	char sendIdentity[4];
	memset(sendIdentity, '\0', 4);
	strcat(sendIdentity, "enc");
	send(socketFD, sendIdentity, 3, 0);

	/* Determine if connecting to correct server */
	char closingMsg[6];
	memset(closingMsg, '\0', 6);
	recv(socketFD, closingMsg, 5, 0);
	if (strcmp(closingMsg, "close") == 0)
	{
		close(socketFD);
		perror("Connecting to wrong socket");
		exit(2);
	}

	/* Gather "raw"/unread file lengths for both text and key files */
	int rFileLen = getCharCount(plainTextFile);
	int rKeyLen = getCharCount(keyTextFile);
	if (rFileLen > rKeyLen)
	{
		error("Key too short!\n");
	}

	/* Send all of the key data to the server */
	sendallFromFile(keyTextFile, socketFD);

	/* Send all of the plain text data to user */
	sendallFromFile(plainTextFile, socketFD);

	/* Receive data from the server, leaving \0 at end */
	char buffer[71000];
	memset(buffer, '\0', 71000);
	receiveData(buffer, socketFD);
	printf("%s\n", buffer);

	/* Close the socket */
	close(socketFD);
	return 0;
}