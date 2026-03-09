import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.SQLException;
import java.util.ArrayList;

public class GeneralFunction implements ActionListener {
    public static String resId;
    public static String schedId;
    public static String eventId;
    public static String userId;
    public static String facilityId;
    public static String dateBooked;
    public static String startTime;
    public static String endTime;
    public static String status;
    public static String eventName;
    public static String numOfParticipants;
    JLabel label = new JLabel();
    JLabel label1 = new JLabel();
    JLabel label2 = new JLabel();
    JLabel label3 = new JLabel();
    JLabel label4 = new JLabel();
    JLabel label5 = new JLabel();
    JLabel label6 = new JLabel();
    JLabel label7 = new JLabel();
    JLabel label8 = new JLabel();
    JLabel label9 = new JLabel();
    JLabel label10 = new JLabel();

    ArrayList<String> arr = new ArrayList<>();

    JTextField text1 = new JTextField();
    JTextField text2 = new JTextField();
    JTextField text3 = new JTextField();
    JTextField text4 = new JTextField();
    JTextField text5 = new JTextField();
    JTextField text6 = new JTextField();
    JTextField text7 = new JTextField();
    JTextField text8 = new JTextField();
    JTextField text9 = new JTextField();
    JTextField text10 = new JTextField();

    JPanel panel1 = new JPanel();



    public static DefaultTableModel model5 = new DefaultTableModel();
    public static JTable table = new JTable(model5);

    JFrame frame = new JFrame("Facility Reservation");
    JButton addButton = new JButton();
    JButton delButton = new JButton();
    JButton updateButton = new JButton();
    JButton refButton = new JButton();
    JButton logOutButton = new JButton();

    GeneralFunction() throws SQLException {
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        addButton.setText("Add");
        addButton.setBounds(15, 650, 120, 40);
        addButton.addActionListener(this);

        delButton.setText("Delete");
        delButton.setBounds(140, 650, 120, 40);
        delButton.addActionListener(this);

        updateButton.setText("Update");
        updateButton.setBounds(260, 650, 120, 40);
        updateButton.addActionListener(this);

        logOutButton.setText("Log Out");
        logOutButton.setBounds(380, 650, 120, 40);
        logOutButton.addActionListener(this);

        refButton.setText("Refresh");
        refButton.setBounds(500, 650, 120, 40);
        refButton.addActionListener(this);

        text1.setPreferredSize(new Dimension(250,40));
        text1.setFont(new Font("Times", Font.PLAIN,15));
        text1.setBounds(50,500,150,25);

        text2.setPreferredSize(new Dimension(250,40));
        text2.setFont(new Font("Times", Font.PLAIN,15));
        text2.setBounds(50,570,150,25);

        text3.setPreferredSize(new Dimension(250,40));
        text3.setFont(new Font("Times", Font.PLAIN,15));
        text3.setBounds(200,500,150,25);

        text4.setPreferredSize(new Dimension(250,40));
        text4.setFont(new Font("Times", Font.PLAIN,15));
        text4.setBounds(200,570,150,25);

        text5.setPreferredSize(new Dimension(250,40));
        text5.setFont(new Font("Times", Font.PLAIN,15));
        text5.setBounds(350,500,150,25);

        /*
        text6.setPreferredSize(new Dimension(250,40));
        text6.setFont(new Font("Times", Font.PLAIN,15));
        text6.setBounds(350,570,150,25);
         */

        text7.setPreferredSize(new Dimension(250,40));
        text7.setFont(new Font("Times", Font.PLAIN,15));
        text7.setBounds(500,500,150,25);

        text8.setPreferredSize(new Dimension(250,40));
        text8.setFont(new Font("Times", Font.PLAIN,15));
        text8.setBounds(500,570,150,25);


        text9.setPreferredSize(new Dimension(250,40));
        text9.setFont(new Font("Times", Font.PLAIN,15));
        text9.setBounds(50,620,150,25);



        text10.setPreferredSize(new Dimension(250,40));
        text10.setFont(new Font("Times", Font.PLAIN,15));
        text10.setBounds(250,620,150,25);


        label.setOpaque(true);
        label.setBounds(250,0,400,50);
        label.setText("Facility Reservation");
        label.setFont(new Font("Times", Font.CENTER_BASELINE,25));

        label1.setOpaque(true);
        label1.setBounds(50,485,50,20);
        label1.setText("User Id");
        label1.setFont(new Font("Times", Font.PLAIN,11));

        label2.setOpaque(true);
        label2.setBounds(50,555,50,20);
        label2.setText("Facility Id");
        label2.setFont(new Font("Times", Font.PLAIN,11));

        label3.setOpaque(true);
        label3.setBounds(200,485,50,20);
        label3.setText("Date");
        label3.setFont(new Font("Times", Font.PLAIN,11));

        label4.setOpaque(true);
        label4.setBounds(200,555,50,20);
        label4.setText("Start Time");
        label4.setFont(new Font("Times", Font.PLAIN,11));

        label5.setOpaque(true);
        label5.setBounds(350,485,50,20);
        label5.setText("End Time");
        label5.setFont(new Font("Times", Font.PLAIN,11));

        /*
        label6.setOpaque(true);
        label6.setBounds(350,555,50,20);
        label6.setText("Status");
        label6.setFont(new Font("Times", Font.PLAIN,11));

         */

        label7.setOpaque(true);
        label7.setBounds(500,485,50,20);
        label7.setText("Event");
        label7.setFont(new Font("Times", Font.PLAIN,11));

        label8.setOpaque(true);
        label8.setBounds(500,555,50,20);
        label8.setText("Number of Participants");
        label8.setFont(new Font("Times", Font.PLAIN,11));

        label9.setOpaque(true);
        label9.setBounds(50,607,50,20);
        label9.setText("schedId");
        label9.setFont(new Font("Times", Font.PLAIN,11));

        label10.setOpaque(true);
        label10.setBounds(300,607,50,20);
        label10.setText("resId");
        label10.setFont(new Font("Times", Font.PLAIN,11));

        frame.setLocation(450, 250);


        // Create a scroll pane and add the table to it
        JScrollPane scrollPane = new JScrollPane(table);

        JPanel panel = new JPanel();
        panel.add(scrollPane);
        panel.setBounds(50,50,600,700);


        //Add buttons in the frame
        frame.add(addButton);
        frame.add(delButton);
        frame.add(updateButton);
        frame.add(refButton);
        frame.add(logOutButton);

        frame.add(text1);
        frame.add(text2);
        frame.add(text3);
        frame.add(text4);
        frame.add(text5);
        frame.add(text6);
        frame.add(text7);
        frame.add(text8);
        frame.add(text9);
        frame.add(text10);

        frame.add(label);
        frame.add(label1);
        frame.add(label2);
        frame.add(label3);
        frame.add(label4);
        frame.add(label5);
        frame.add(label6);
        frame.add(label7);
        frame.add(label8);
        frame.add(label9);
        frame.add(label10);

        frame.add(panel);
        frame.setSize(800, 750);
        frame.setLayout(null);
        frame.setVisible(true);
        Main.display();

    }
    public static void run(){
        Main.setCon();
    }
    public static void refreshTable() throws SQLException {
        Main.closeConnection();
    //    Main.setCon();
    }
    @Override
    public void actionPerformed(ActionEvent e) {
        run();

        frame.dispose();
        if(e.getSource() == addButton){
            arr.add("User Id: " + text1.getText() + "\nFacility Id: " + text2.getText()
                    + "\nDate Booked: " + text3.getText() + "\nStart Time: " + text4.getText() + "\nEnd Time: " + text5.getText()
                    + "\nStatus: " + text6.getText() + "\nEvent Name: " + text7.getText() + "\nNumber of Participants: " + text8.getText());

            userId = text1.getText();
            facilityId = text2.getText();
            dateBooked = text3.getText();
            startTime = text4.getText();
            endTime = text5.getText();
          //  status = text6.getText();
            eventName = text7.getText();
            numOfParticipants = text8.getText();

            Schedule s = new Schedule(schedId, facilityId, dateBooked, startTime, endTime, status);
            Event ev = new Event(eventId, eventName, numOfParticipants);
            Main.addRes(s, ev);
            Main.confirmMe(userId);

            JOptionPane.showMessageDialog(null,"Added! \n" + arr,"Confirmation",JOptionPane.INFORMATION_MESSAGE);
            try {
                refreshTable();
                new GeneralFunction();
            } catch (SQLException ex) {
            }

        } else if (e.getSource() == delButton){
            schedId = text9.getText();
            resId = text10.getText();

            Main.deleteDataBySched(schedId);
            Main.deleteDataByResId(resId);
            JOptionPane.showMessageDialog(null,"Deleted! \n","DATA UPDATE",JOptionPane.INFORMATION_MESSAGE);

            try {
                refreshTable();
                new GeneralFunction();
            } catch (SQLException ex) {
            }

        } else if (e.getSource() == updateButton){
            arr.add("User Id: " + text1.getText() + "\nFacility Id: " + text2.getText()
                    + "\nDate Booked: " + text3.getText() + "\nStart Time: " + text4.getText() + "\nEnd Time: " + text5.getText()
                    + "\nStatus: " + text6.getText() + "\nEvent Name: " + text7.getText() + "\nNumber of Participants: " + text8.getText());


            userId = text1.getText();
            facilityId = text2.getText();
            dateBooked = text3.getText();
            startTime = text4.getText();
            endTime = text5.getText();
       //     status = text6.getText();
            eventName = text7.getText();
            numOfParticipants = text8.getText();
            schedId = text9.getText();

            Main.updateDataBySched(schedId,userId,facilityId,dateBooked,startTime,endTime,status,eventName,numOfParticipants);
            JOptionPane.showMessageDialog(null,"Updated! \n" + arr,"Confirmation",JOptionPane.INFORMATION_MESSAGE);

            try {
                refreshTable();
                run();
                new GeneralFunction();
            } catch (SQLException ex) {
                JOptionPane.showMessageDialog(null,ex);
            }

        } else if (e.getSource() == refButton){
            try {
                refreshTable();
                new GeneralFunction();
                Main.display();
            } catch (SQLException es) {

            }
        } else if (e.getSource() == logOutButton){
            try {
                refreshTable();
                LogIn log = new LogIn();
            } catch (SQLException ex) {
            }
        }
    }
}