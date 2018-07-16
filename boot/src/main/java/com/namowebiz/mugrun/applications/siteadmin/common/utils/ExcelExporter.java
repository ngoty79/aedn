package com.namowebiz.mugrun.applications.siteadmin.common.utils;


import jodd.bean.BeanUtil;
import jodd.typeconverter.TypeConverterManager;
import lombok.extern.apachecommons.CommonsLog;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;

/**
 * Created with IntelliJ IDEA.
 * User: vlqhai
 * Date: 8/22/12
 * Time: 9:23 AM
 */
@CommonsLog
public class ExcelExporter {

    public static void export(OutputStream outputStream, Object[] objects, String sheetName, String[] headers, String[] properties) {
        export(outputStream, objects, sheetName, headers, properties, false);
    }

    public static void export(OutputStream outputStream, Object[] objects, String sheetName, String[] headers, String[] properties, boolean printFirstIndexColumn) {
        Workbook workbook = new HSSFWorkbook();
        try {
            //create worksheet
            Sheet sheet = workbook.createSheet(sheetName);

            Row headerRow = sheet.createRow((short) 0);
            if (printFirstIndexColumn) {
                Cell firstCell = headerRow.createCell(0);
                firstCell.setCellValue("No");

                for (int i = 0; i < headers.length; i++) {
                    Cell cell = headerRow.createCell(i + 1);
                    cell.setCellValue(headers[i]);
                }
            } else {
                for (int i = 0; i < headers.length; i++) {
                    Cell cell = headerRow.createCell(i);
                    cell.setCellValue(headers[i]);
                }
            }

            for (int i = 0; i < objects.length; i++) {

                //create new row
                Row row = sheet.createRow(i + 1);
                if (printFirstIndexColumn) {
                    Cell firstCell = row.createCell(0);
                    firstCell.setCellValue(i + 1);

                    for (int j = 0; j < properties.length; j++) {
                        String val = TypeConverterManager.convertType(BeanUtil.getProperty(objects[i], properties[j]), String.class);
                        //create cell
                        Cell cell = row.createCell(j + 1);
                        cell.setCellValue(val);
                    }
                } else {
                    for (int j = 0; j < properties.length; j++) {
                        String val = TypeConverterManager.convertType(BeanUtil.getProperty(objects[i], properties[j]), String.class);
                        //create cell
                        Cell cell = row.createCell(j);
                        cell.setCellValue(val);
                    }
                }
            }
            workbook.write(outputStream);
        } catch (FileNotFoundException e) {
            log.error(e.getMessage(),e);
        } catch (IOException e) {
            log.error(e.getMessage(),e);
        } finally {
            try {
                if (outputStream != null) {
                    outputStream.close();
                }
                workbook.close();
            } catch (IOException e) {
                log.error(e.getMessage(),e);
            }
        }
    }


}
