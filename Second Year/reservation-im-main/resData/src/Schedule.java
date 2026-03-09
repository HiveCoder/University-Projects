public class Schedule {
    private String SchedId;
    private String FacilityId;
    private String DateBooked;
    private String StartTime;
    private String EndTime;
    private String Status;


    public Schedule(){}

    public Schedule(String si, String fi, String db, String st, String et, String ss){
        this.SchedId = si;
        this.FacilityId = fi;
        this.DateBooked = db;
        this.StartTime = st;
        this.EndTime = et;
        this.Status = ss;
    }
    public String getSchedId(){
        return this.SchedId;
    }
    public String getFacilityId(){
        return this.FacilityId;
    }
    public String getDateBooked(){
        return this.DateBooked;
    }
    public String getStartTime(){
        return this.StartTime;
    }
    public String getEndTime() {
        return this.EndTime;
    }
    public String getStatus(){
        return this.Status;
    }
}
