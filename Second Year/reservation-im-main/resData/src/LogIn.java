import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.SQLException;

public class LogIn implements ActionListener {
    public static String email;
    public static String password;
    JFrame frame = new JFrame();
    JButton button = new JButton();
    JButton regButton = new JButton();
    JLabel userName1 = new JLabel();
    JLabel passWord1 = new JLabel();
    JTextField text1 = new JTextField();
    JTextField text2 = new JTextField();
    JLabel label = new JLabel();
    LogIn(){
        label.setOpaque(true);
        label.setBounds(175,0,200,75);
        label.setText("Log In Form");
        label.setFont(new Font("Times", Font.CENTER_BASELINE,25));

        text1.setPreferredSize(new Dimension(250,40));
        text1.setFont(new Font("Times", Font.PLAIN,11));
        text1.setBounds(150,185,200,20);

        text2.setPreferredSize(new Dimension(250,40));
        text2.setFont(new Font("Times", Font.PLAIN,11));
        text2.setBounds(150,250,200,20);

        userName1.setText("Username");
        userName1.setOpaque(true);
        userName1.setFont(new Font("Times", Font.PLAIN, 15));
        userName1.setBounds(150,160,200,20);

        passWord1.setText("Password");
        passWord1.setOpaque(true);
        passWord1.setFont(new Font("Times", Font.PLAIN, 15));
        passWord1.setBounds(150,225,200,20);

        button.setText("Log In");
        button.addActionListener(this);
        button.setBounds(200,300,100,20);

        regButton.setText("Register");
        regButton.addActionListener(this);
        regButton.setBounds(350,400,100,20);

        frame.setLocation(500, 250);

        frame.add(button);
        frame.add(regButton);
        frame.add(userName1);
        frame.add(passWord1);
        frame.add(text1);
        frame.add(text2);
        frame.add(label);

        frame.setTitle("Log In Form");
        frame.setLayout(null);
        frame.setSize(500,500);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setVisible(true);
    }
    public static void run(){
        Main.setCon();
    }
    public void refreshTable() throws SQLException {
        Main.closeConnection();
   //     Main.setCon();

    }
    @Override
    public void actionPerformed(ActionEvent e) {
        frame.dispose();
        if(e.getSource() == regButton){
            try {
                refreshTable();
            } catch (SQLException ex) {
            }
            RegistrationGUI reg = new RegistrationGUI();

        } else if (e.getSource() == button){
            email = text1.getText();
            password = text2.getText();
            try {
                refreshTable();
                Main.verifyUser(email, password);
                Main.display();
        //        GeneralFunction gf = new GeneralFunction();
            } catch (SQLException ex) {
            }

        }
    }
}
