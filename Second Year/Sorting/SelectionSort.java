package ComparisonOfAlgorithms;

import java.util.ArrayList;

public class SelectionSort {
    public static void main(String[] args)  {
        Populate pcs = new Populate();
        pcs.populateArray();

        ArrayList<Integer> intList = new ArrayList<Integer>();
        toInteger(intList, pcs.list);

        int[] arr = new int[intList.size()];
        for (int i = 0; i < intList.size(); i++) {
            arr[i] = intList.get(i);
        }
        selectionSort(arr);
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

    public static void selectionSort(int[] array) {
        long counter = 0;
        for (int x = 0; x < array.length - 1; x++) {
            counter++;
            int min = x;
            counter++;
            for (int y = x + 1; y < array.length; y++) {
                counter++;
                if (array[y] < array[min]) {
                    counter++;
                    min = y;
                    counter++;
                }
            }
            int temp = array[x];
            counter++;
            array[x] = array[min];
            counter++;
            array[min] = temp;
            counter++;
        }
        System.out.println(counter);
    }
}//