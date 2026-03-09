public class Event {
    private String EventId;
    private String EventName;
    private String NumOfParticipants;
    public Event(){
    }
    public Event(String ei, String en, String np){
        super();
        this.EventId = ei;
        this.EventName = en;
        this.NumOfParticipants = np;
    }
    public String getEventId(){
        return this.EventId;
    }
    public String getEventName(){
        return this.EventName;
    }
    public String getNumOfParticipants(){
        return this.NumOfParticipants;
    }
}