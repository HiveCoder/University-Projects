public class Facility {
    private int FacilityId;
    private String FacilityName;
    private String Capacity;
    public Facility(){
    }
    public Facility(int fi, String fn, String c){
        super();
        this.FacilityId = fi;
        this.FacilityName = fn;
        this.Capacity = c;
    }
        public int getFacilityId(){
        return this.FacilityId;
    }
        public String getFacilityName(){
        return this.FacilityName;
        }
        public String getCapacity(){
        return this.Capacity;
        }
}