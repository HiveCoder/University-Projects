import java.io.FileWriter;
import java.util.ArrayList;
import java.util.Scanner;
public class ReaderAndWriter {
    private static Scanner sc = new Scanner(System.in);
    RegistrationGUI reg = new RegistrationGUI();
    private static Boolean isCredentialsValid;

    public void writeInFile(ArrayList<String> arr) {
        try {
            FileWriter fw = new FileWriter("user.txt", true);
            fw.append(arr + "\n\n");
            fw.close();
        } catch (Exception e) {
            System.out.println("Failed to add data");
        }
    }
    public static void run(){
        Main.setCon();
    }
    /*
        public static void readFile(String email, String password) {
            String fileName = "user.txt";
            String line;

          run();
            try (BufferedReader br = new BufferedReader(new FileReader(fileName))) {
                while ((line = br.readLine()) != null) {
                    if (line.contains("email: " + email) && line.contains("password: " + password)) {
                        isCredentialsValid = true;
                    } else {
                        isCredentialsValid = false;
                    }
                }
                if (isCredentialsValid = true) {
                    JOptionPane.showMessageDialog(null, "You are now logged in!");
                    try {
                        Main.display();
                        GeneralFunction gf = new GeneralFunction();
                    } catch (SQLException ex) {
                        ex.printStackTrace();
                    }
                } else if (isCredentialsValid = false){
                    JOptionPane.showMessageDialog(null, "Invalid email or password!", "INVALID CREDENTIALS", JOptionPane.INFORMATION_MESSAGE);
                    LogIn in = new LogIn();
                }

            } catch (IOException e) {
                e.printStackTrace();
                System.out.println("An error occurred while reading the file: " + e.getMessage());
            }

        }

     */

    }

