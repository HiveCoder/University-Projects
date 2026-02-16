package ComparisonOfAlgorithms;

import java.util.ArrayList;

public class InsertionSort {
    public static void main(String[] args) throws Exception {
        Populate pcs = new Populate();
        pcs.populateArray();

        ArrayList<Integer> intList = new ArrayList<Integer>();
        toInteger(intList, pcs.list);

        int[] arr = new int[intList.size()];
        for (int i = 0; i < intList.size(); i++) {
            arr[i] = intList.get(i);
        }

        insertionSort(arr);
    }

    public static void toInteger (ArrayList<Integer> num, ArrayList<String> str) {
        for (String strVal : str) {
            try {
                num.add(Integer.parseInt(strVal));
            } catch (NumberFormatException e) {
                System.out.println(e.getMessage());
            }
        }
    }

    public static void insertionSort(int[] array) {
        int temp, i, x;
        long counter = 0;

        for (i = 1; i < array.length; i++) {
            counter++;
            temp = array[i];
            counter++;
            x = i - 1;
            counter++;

            while (x >= 0 && temp <= array[x]) {
                counter++;
                array[x + 1] = array[x];
                counter++;
                x = x - 1;
                counter++;
            }
            array[x + 1] = temp;
            counter++;
        }
        System.out.println(counter);
    }
}//