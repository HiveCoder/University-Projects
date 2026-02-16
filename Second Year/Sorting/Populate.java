package ComparisonOfAlgorithms;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;


public class Populate {
    ArrayList<String> list = new ArrayList<>(); //Creates object of ArrayList
    Scanner fileReader = new Scanner(System.in);
    String location = "res/10000_DataSets_Random.csv";

    public void populateArray() {
        try{
            String temp[]; //Holds the value of the separated values
            fileReader = new Scanner(new File(location)); //Creates an object of Scanner

            do {
                int x = 0;
                String num = fileReader.next();
                temp =  num.split(","); //Splits values separated by comma
                String data = temp[x++];
                list.add(data); // Store all the values in a ArrayList

            }while (fileReader.hasNext());
            fileReader.close();
        }catch (FileNotFoundException exc){
            System.out.println(exc.getMessage());
        }
    }
}//