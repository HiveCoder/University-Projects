#include <iostream>
#include <stdio.h>
#include <string.h>

static int choice;

void encrypt(char password[],int key)
{
    unsigned int i;
    for(i=0;i<strlen(password);++i)
    {
        password[i] = password[i] - key;
    }
}
void decrypt(char password[],int key)
{
    unsigned int i;
    for(i=0;i<strlen(password);++i)
    {
        password[i] = password[i] + key;
    }
}
int main() {

    //0XABBBFF
    //0XABBFF
    //0XABFF
    //0XAFF
    //0XFF

    while (true) {
        char password[20];

        printf("\n=========================== PASSWORD ENCRYPTION AND DECRYPTION WITH SEED ===========================\n");
        printf("\n Enter your choices: \n1. Encrypt Password \n2. Decrypt Password \n3. Generate Seed Password \n4. Exit Program\n");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                printf("\n""Enter the password: ");
                scanf("%s", password);
                printf("Password = %s", password);
                encrypt(password, 0xFF);
                printf("\n""Encrypted value = %s", password);
                decrypt(password, 0XFF);
                printf("\n""Decrypted value = %s", password);
                break;

            case 2:
                printf("\n""Enter the decryption: ");
                scanf("%s", password);
                printf("Password = %s", password);
                decrypt(password, 0xFF);
                printf("\n""Decrypted value = %s", password);
                break;

            case 3:
                int password_length;
                printf("\nEnter the length of the password: ");
                scanf("%d", &password_length);

                char password_data[] =
                        "abcdefghijklmnopqrstuvwxyz"
                        "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                        "1234567890";

                if (password_length >= 5 && password_length <= 20) {
                    srand(time(NULL));
                    printf("Password: ");
                    for (int i = 0; i < password_length; i++) {
                        printf("%c", password_data[rand() % sizeof(password_data) - 1]);
                    }
                } else {
                    printf("\nInvalid password length\n");
                    main();
                }
                break;
        }
        if (choice == 4){
            exit(0);
        }
    }
}
