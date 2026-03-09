public class User {
    private String userID;
    private String firstName;
    private String lastName;
    private String email;
    private String role;


    public User(){

    }
    public User(String u, String fn, String ln, String e, String r){
        this.userID = u;
        this.firstName = fn;
        this.lastName = ln;
        this.email = e;
        this.role = r;
    }

    public String getUserID() {
        return userID;
    }
    public String getFirstName() {
        return firstName;
    }
    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}
