import javax.swing.*;
import java.sql.*;

public class Main {
    public static Connection con;
    public static void setCon(){
        try{
            con = DriverManager.getConnection("jdbc:mysql://localhost:3306/resData2?user=root&password=");
        }catch (Exception e){
            e.printStackTrace();
        }
    }
    public static void display() throws SQLException{

        // Execute query to retrieve data
        String query = "SELECT * FROM facility Natural Join schedule";
        Statement stmt = con.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
        ResultSet rs = stmt.executeQuery(query);
        ResultSetMetaData rsmd = rs.getMetaData();
        int columnCount = rsmd.getColumnCount();

        for (int i = 1; i <= columnCount; i++) {
            String columnName = rsmd.getColumnName(i);
            GeneralFunction.model5.addColumn(columnName);

        }

        while (rs.next()) {
            Object[] rowData = new Object[columnCount];
            for (int i = 1; i <= columnCount; i++) {
                rowData[i - 1] = rs.getString(i);
            }
            GeneralFunction.model5.addRow(rowData);

        }

        rs.close();
        stmt.close();
        con.close();

    }

    public static void displayFacility() throws SQLException{

        // Execute query to retrieve data
        String query = "SELECT * FROM facility";
        Statement stmt = con.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
        ResultSet rs = stmt.executeQuery(query);
        ResultSetMetaData rsmd = rs.getMetaData();
        int columnCount = rsmd.getColumnCount();

        for (int i = 1; i <= columnCount; i++) {
            String columnName = rsmd.getColumnName(i);
            GeneralFunction.model5.addColumn(columnName);
        }

        while (rs.next()) {
            Object[] rowData = new Object[columnCount];
            for (int i = 1; i <= columnCount; i++) {
                rowData[i - 1] = rs.getString(i);
            }
            GeneralFunction.model5.addRow(rowData);
        }

        rs.close();
        stmt.close();
        closeConnection();

    }

    public static void addUser (User u) {
        String userQuery = "INSERT INTO user(firstName, lastName, email, role) VALUES(?,?,?,?)";

        try {
            PreparedStatement userPs = con.prepareStatement(userQuery);
            userPs.setString(1,u.getFirstName());
            userPs.setString(2,u.getLastName());
            userPs.setString(3,u.getEmail());
            userPs.setString(4,u.getRole());

            userPs.executeUpdate();

        } catch (SQLException e) {
            System.out.print("Failed to add new record: " + e.getMessage());
        }
    }
    public static void addRes(Schedule s, Event ev) {
        String scheduleQuery = "INSERT INTO schedule(facilityId, dateBooked, startTime, endTime, status) VALUES (?, ?, ?, ?, 'active')";
        String eventQuery = "INSERT INTO event(eventName, numOfParticipants) VALUES (?, ?)";

        try {
            PreparedStatement schedulePs = con.prepareStatement(scheduleQuery);
            schedulePs.setString(1, s.getFacilityId());
            schedulePs.setString(2, s.getDateBooked());
            schedulePs.setString(3, s.getStartTime());
            schedulePs.setString(4, s.getEndTime());

            schedulePs.executeUpdate();

            PreparedStatement eventPs = con.prepareStatement(eventQuery);
            eventPs.setString(1, ev.getEventName());
            eventPs.setString(2, ev.getNumOfParticipants());

            eventPs.executeUpdate();

        } catch (SQLException es) {
            System.out.print("Failed to add new reservation: " + es.getMessage());
        }
    }
    public static void confirmMe(String userId) {
        String facilityQuery = "SELECT facilityId FROM schedule ORDER BY schedId DESC LIMIT 1";
        String scheduleQuery = "SELECT * FROM schedule ORDER BY schedId DESC LIMIT 1";
        String eventQuery = "SELECT * FROM event ORDER BY eventId DESC LIMIT 1";

        try {
            PreparedStatement facilityPs = con.prepareStatement(facilityQuery);
            ResultSet facilityRs = facilityPs.executeQuery();
            facilityRs.next();
            int facilityId = facilityRs.getInt("facilityId");

            PreparedStatement schedulePs = con.prepareStatement(scheduleQuery);
            ResultSet scheduleRs = schedulePs.executeQuery();
            scheduleRs.next();
            int schedId = scheduleRs.getInt("schedId");

            PreparedStatement eventPs = con.prepareStatement(eventQuery);
            ResultSet eventRs = eventPs.executeQuery();
            eventRs.next();
            int eventId = eventRs.getInt("eventId");

            String insertQuery = "INSERT INTO reservation (userId, facilityId, schedId, eventId) VALUES ("+userId+", ?, ?, ?)";
            PreparedStatement insertPs = con.prepareStatement(insertQuery);
            insertPs.setInt(1, facilityId);
            insertPs.setInt(2, schedId);
            insertPs.setInt(3, eventId);

            insertPs.executeUpdate();

            System.out.println("Confirmation successful.");

        } catch (SQLException es) {
            System.out.print("Failed to perform confirmation: " + es.getMessage());
        }
    }
    public static void deleteDataBySched(String schedId) {
        try {
            String deleteQuery = "DELETE FROM `reservation`, `schedule`, `event` " +
                    "USING `reservation` " +
                    "INNER JOIN `schedule` ON `reservation`.`schedId` = `schedule`.`schedId` " +
                    "INNER JOIN `event` ON `reservation`.`eventId` = `event`.`eventId` " +
                    "WHERE `reservation`.`schedId` = ?";

            PreparedStatement deleteStmt = con.prepareStatement(deleteQuery);
            deleteStmt.setString(1, schedId);
            int rowsAffected = deleteStmt.executeUpdate();

            System.out.println("Deleted " + rowsAffected + " rows for schedId " + schedId);
        } catch (SQLException e) {
            // Handle any potential exceptions here
        }
    }
    public static void deleteDataByResId(String resId) {
        try {
            String deleteQuery = "DELETE FROM `reservation`, `schedule`, `event` " +
                    "USING `reservation` " +
                    "INNER JOIN `schedule` ON `reservation`.`schedId` = `schedule`.`schedId` " +
                    "INNER JOIN `event` ON `reservation`.`eventId` = `event`.`eventId` " +
                    "WHERE `reservation`.`resId` = ?";

            PreparedStatement deleteStmt = con.prepareStatement(deleteQuery);
            deleteStmt.setString(1, resId);
            int rowsAffected = deleteStmt.executeUpdate();

            System.out.println("Deleted " + rowsAffected + " rows for resId " + resId);
        } catch (SQLException e) {
            // Handle any potential exceptions here
        }
    }

    public static void updateDataBySched(String schedId,String userId, String facilityId, String dateBooked, String startTime, String endTime, String status, String eventName, String numOfParticipants) {
        try {

            PreparedStatement stmt = con.prepareStatement("UPDATE `event` SET `eventName` = '"+eventName+"', `numOfParticipants` = "+numOfParticipants+" WHERE `eventId` IN (SELECT `eventId` FROM reservation WHERE `schedId` = "+schedId+")");
            stmt.executeUpdate();

            PreparedStatement stmt2 = con.prepareStatement(
                    "UPDATE `schedule` s, `reservation` r " +
                            "SET s.`facilityId` = "+facilityId+", s.`dateBooked` = "+dateBooked+", s.`startTime` = "+startTime+", s.`endTime` = "+endTime+", s.`status` = 'updated', r.`userId` = "+userId+", r.`facilityId` = "+facilityId+" " +
                            "WHERE s.`schedId` = "+schedId+"  AND r.`schedId` = "+schedId+"");
            stmt2.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    public static void updateDataByRes(String resId,String userId, String facilityId, String dateBooked, String startTime, String endTime, String status, String eventName, String numOfParticipants) {
        try {

            PreparedStatement stmt = con.prepareStatement("UPDATE `event` SET `eventName` = '"+eventName+"', `numOfParticipants` = "+numOfParticipants+" WHERE `eventId` IN (SELECT `eventId` FROM reservation WHERE `resId` = "+resId+")");
            stmt.executeUpdate();

            PreparedStatement stmt2 = con.prepareStatement(
                    "UPDATE `schedule` s, `reservation` r " +
                            "SET s.`facilityId` = "+facilityId+", s.`dateBooked` = "+dateBooked+", s.`startTime` = "+startTime+", s.`endTime` = "+endTime+", s.`status` = '"+status+"', r.`userId` = "+userId+", r.`facilityId` = "+facilityId+" " +
                            "WHERE s.`schedId` = "+resId+"  AND r.`schedId` = "+resId+"");
            stmt2.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    public static void verifyUser(String email, String userId) {
        String query = "SELECT email, userId FROM user WHERE email = ? AND userId = ?";
        try (Connection newCon = DriverManager.getConnection("jdbc:mysql://localhost:3306/resData2?user=root&password=");
             PreparedStatement ps = newCon.prepareStatement(query)) {
            ps.setString(1, email);
            ps.setString(2, userId);

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                JOptionPane.showMessageDialog(null, "Login successful!");
                GeneralFunction.refreshTable();
                GeneralFunction.run();
               new GeneralFunction();
                con.close(); // Close the current connection
        //        con = newCon; // Set the new connection
            } else {
                JOptionPane.showMessageDialog(null, "Invalid email or userId!");
                GeneralFunction.refreshTable();
                new LogIn();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }


    /*
    public static void verifyUser(String email, String userId){
        String query = "SELECT user.email, user.userId FROM user WHERE email = "+email+" AND password = "+userId+"";
        try{
            PreparedStatement ps = con.prepareStatement(query,ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
            ps.executeUpdate();
        }catch (SQLException e){
        }
    }

     */

    public static void closeConnection() {
        try {
            if (con != null && !con.isClosed()) {
                con.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        setCon();
        LogIn in = new LogIn();
    }
}