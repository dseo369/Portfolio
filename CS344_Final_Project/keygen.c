/*******************************************************************************
** Author: Lucas Pichette
** Date: 4th March 2021
** OSU CS344 W21
*******************************************************************************/

#include <stdlib.h> /* { atoi } */
#include <stdio.h>	/* { getline } */
#include <string.h> /* { strdup } */
#include <time.h>	/* { time } */

#define maxint 2147483648 /* 2^32 / 2 - 1 */

int gatherkeylength(int argc, char *argv[])
{
	int keylength = 0;

	if (argc > 1)
	{
		/* atoi returns 0 if no valid conversion could be performed. */
		keylength = atoi(argv[1]);
	}
	else
	{
		/* while not valid conversion or input of '0' */
		while (!keylength)
		{
			char *newlength;
			size_t size = maxint;
			getline(&newlength, &size, stdin);
			keylength = atoi(newlength);
		}
	}

	return keylength;
}

char *keygen(int length)
{
	int i;
	/* 27 allowed characters: [A-Z ]{1,length} */
	time_t t;

	/* +1 is for the additional newline character */
	char *key = (char *)malloc((length + 1) * sizeof(char));
	/* ensure all characters in array aren't garbage upon initialization */
	memset(key, '\0', length + 1);

	/* seed/initialize the rng */
	srand((unsigned)time(&t));

	for (i = 0; i < length; i++)
	{
		/* will generate a random number between 65-90
		 random number correlates to ascii value of character A-Z */
		char randchar = rand() % 26 + 65;
		key[i] = randchar;
	}

	key[length] = '\n';

	return key;
}

int main(int argc, char *argv[])
{
	int keylength = gatherkeylength(argc, argv);

	/* will generate [A-Z\n]{keylength} characters in a 1D dynamic array */
	char *key = keygen(keylength);

	/* Print the key return from keygen to stdout.
	 User can use redirection operators if they would like. */
	printf("%s", key);

	/* keygen allocated dynamic memory on the heap that we need to free */
	free(key);

	return 0;
}
