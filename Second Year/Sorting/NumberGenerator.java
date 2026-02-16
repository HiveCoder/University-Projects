package ComparisonOfAlgorithms;

import java.util.Scanner;
import java.util.Random;
import java.util.random.RandomGenerator;
import java.util.stream.IntStream;

public class NumberGenerator {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int choice;

        System.out.println("""
                Choose:
                1. ascending
                2. descending
                3. random
                """);
        choice = sc.nextInt();
        switch (choice) {
            case 1 -> ascending();
            case 2 -> descending();
            case 3 -> random();
        }
    }

    public static void descending(){
        for(int i = 10001; i > 1; i--){
            System.out.println(i);
        }
    }

    public static void ascending(){
        for(int i = 1; i < 10001; i++){
            System.out.println(i);
        }
    }

    public static void random(){
        // nextInt(max - min + 1) + min
        int maximum = 10000;
        int minimum = 1;
        Random t = new Random();
        IntStream.rangeClosed(minimum, maximum).map(t::nextInt)
                .forEach(System.out::println);
    }
}
