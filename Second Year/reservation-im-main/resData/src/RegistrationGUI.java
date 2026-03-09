import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Scanner;

public class RegistrationGUI implements ActionListener {

    private static Scanner sc = new Scanner(System.in);
    public static String userId;
    public static String firstName;
    public static String lastName;
    public static String email;
    public static String role;
    public static String password;
    public static String confirmPassword;

    ArrayList<String> arr = new ArrayList();
    JFrame frame = new JFrame();
    JButton button = new JButton();
    JButton button2 = new JButton();
    JLabel label = new JLabel();
    JLabel label1 = new JLabel();
    JLabel label2 = new JLabel();
    JLabel label3 = new JLabel();
    JLabel label4 = new JLabel();
    JLabel label5 = new JLabel();
    JLabel label6 = new JLabel();

    JTextField text1 = new JTextField();
    JTextField text2 = new JTextField();
    JTextField text3 = new JTextField();
    JTextField text4 = new JTextField();
    JTextField text5 = new JTextField();
    JTextField text6 = new JTextField();


    RegistrationGUI(){
        text1.setPreferredSize(new Dimension(250,40));
        text1.setFont(new Font("Times", Font.PLAIN,15));
        text1.setBounds(50,100,150,25); //200, 275, 120

        text2.setPreferredSize(new Dimension(250,40));
        text2.setFont(new Font("Times", Font.PLAIN,15));
        text2.setBounds(250,100,150,25);

        text3.setPreferredSize(new Dimension(250,40));
        text3.setFont(new Font("Times", Font.PLAIN,15));
        text3.setBounds(50,175,150,25);

        text4.setPreferredSize(new Dimension(250,40));
        text4.setFont(new Font("Times", Font.PLAIN,15));
        text4.setBounds(250,175,150,25);

        text5.setPreferredSize(new Dimension(250,40));
        text5.setFont(new Font("Times", Font.PLAIN,15));
        text5.setBounds(50,250,150,25);

        text6.setPreferredSize(new Dimension(250,40));
        text6.setFont(new Font("Times", Font.PLAIN,15));
        text6.setBounds(250,250,150,25);

        label.setOpaque(true);
        label.setBounds(150,0,200,75);
        label.setText("Registration Form");
        label.setFont(new Font("Times", Font.CENTER_BASELINE,25));

        label1.setOpaque(true);
        label1.setBounds(100,80,50,20);
        label1.setText("Lastname");
        label1.setFont(new Font("Times", Font.PLAIN,11));

        label2.setOpaque(true);
        label2.setBounds(300,80,50,20);
        label2.setText("Firstname");
        label2.setFont(new Font("Times", Font.PLAIN,11));

        label3.setOpaque(true);
        label3.setBounds(105,158,50,20);
        label3.setText("Email");
        label3.setFont(new Font("Times", Font.PLAIN,11));

        label4.setOpaque(true);
        label4.setBounds(305,158,50,20);
        label4.setText("Role");
        label4.setFont(new Font("Times", Font.PLAIN,11));

        label5.setOpaque(true);
        label5.setBounds(105,216,50,20);
        label5.setText("Password");
        label5.setFont(new Font("Times", Font.PLAIN,11));

        label6.setOpaque(true);
        label6.setBounds(305,216,50,20);
        label6.setText("Confirm Password");
        label6.setFont(new Font("Times", Font.PLAIN,11));

        button.setBounds(200,400,100,25);
        button.addActionListener(this);
        button.setText("Register");
        button.setFont(new Font("Times", Font.CENTER_BASELINE,15));

        button2.setBounds(300,425,100,25);
        button2.addActionListener(this);
        button2.setText("Cancel");
        button2.setFont(new Font("Times", Font.CENTER_BASELINE,15));


        // Set the location of the frame to the center
        frame.setLocation(500, 250);

        frame.add(button2);
        frame.add(button);
        frame.add(text1);
        frame.add(text2);
        frame.add(text3);
        frame.add(text4);
        frame.add(text5);
        frame.add(text6);
        frame.add(label);
        frame.add(label1);
        frame.add(label2);
        frame.add(label3);
        frame.add(label4);
        frame.add(label5);
        frame.add(label6);

        frame.setTitle("Registration Form");
        frame.setSize(500,500);
        frame.setLayout(null);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setVisible(true);
    }
    public static void run() {
        Main.setCon();
    }

    public void refreshTable() throws SQLException {
        Main.closeConnection();
    }
    @Override
    public void actionPerformed(ActionEvent e) {
        frame.dispose();
        run();
        if(e.getSource()==button){
            arr.add("Lastname: " + text1.getText() + "\nFirstname: " + text2.getText() +
                    "\nEmail: " + text3.getText() + "\nRole: " + text4.getText() + "\nPassword: " + text6.getText());

            lastName = text1.getText();
            firstName = text2.getText();
            email = text3.getText();
            role = text4.getText();
            password = text5.getText();
            confirmPassword = text6.getText();

            User u = new User(userId, lastName, firstName, email, role);
            Main.addUser(u);
            try {
                refreshTable();
            } catch (SQLException ex) {
            }
            /*
            if(password != confirmPassword){
                JOptionPane.showMessageDialog(null,"The password is not matched!");
            } else {
                ReaderAndWriter rw = new ReaderAndWriter();
                rw.writeInFile(arr);
            }
             */
            JOptionPane.showMessageDialog(null, "You are now registered! \n" + arr, "Confirmation", JOptionPane.INFORMATION_MESSAGE);
            //     Main.closeConnection();
            } else if (e.getSource() == button2){
            LogIn login = new LogIn();
            try {
                refreshTable();
            } catch (SQLException ex) {
            }
        }
    }
}
