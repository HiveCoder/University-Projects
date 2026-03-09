public class Reservation {
    private String resId;
    private String userId;
    private String facilityId;
    private String schedId;
    private String eventId;

    public Reservation(String resId, String userId, int facilityId, String schedId, String eventId){}

    public Reservation(String ri, String ui, String fi, String si, String ei){
        this.resId = ri;
        this.userId = ui;
        this.facilityId = fi;
        this.schedId = si;
        this.eventId = ei;
    }
    public String getResId(){
        return this.resId;
    }
    public String getUserId(){
        return this.userId;
    }
    public String getFacilityId(){
        return this.facilityId;
    }
    public String getSchedId() {
        return this.schedId;
    }
    public String getEventId() {
        return this.eventId;
    }
}
