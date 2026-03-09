package ComparisonOfAlgorithms;

import java.util.ArrayList;

public class BubbleSort {
    public static void bubbleSort(int array[]) {
        int n = array.length;
        long counter = 0;

        for(int x = 0; x < n-1; x++) {
            counter++;
            for (int y = 0; y < n - x - 1; y++) {
                counter++;
                if (array[y] > array[y + 1]) {
                    counter++;
                    int temp = array[y];
                    counter++;
                    array[y] = array[y + 1];
                    counter++;
                    array[y + 1] = temp;
                    counter++;
                }
            }
        }
        System.out.println(counter);
    }

    public static void main(String[] args) throws Exception {
        Populate pcs = new Populate();
        pcs.populateArray();

        ArrayList<Integer> intList = new ArrayList<Integer>();
        toInteger(intList, pcs.list);

        int[] arr = new int[intList.size()];
        for (int i = 0; i < intList.size(); i++) {
            arr[i] = intList.get(i);
        }
        bubbleSort(arr);
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
}//