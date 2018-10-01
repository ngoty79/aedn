package com.namowebiz.mugrun.applications.framework.common.utils;


import jodd.bean.BeanUtil;
import lombok.extern.apachecommons.CommonsLog;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Util class for excel related tasks.
 * Created by NgocSon on 11/20/2015.
 */
@CommonsLog
public class ExcelUtil {
    /**
     * Export a list of object data to excel file.
     *
     * @param outputStream OutputStream
     * @param sheetName the name of the sheet containing exported data
     * @param objects the array of objects to export
     * @param propertyNames the array of object's property names to export
     * @param headers the headers property names
     * @param columnWidth the column width (1 unit = 1 character width)
     */
    public static void export(OutputStream outputStream, String sheetName,
                              Object[] objects, String[] propertyNames, String[] headers, short[] columnWidth) {
        Workbook workbook = new HSSFWorkbook();
        try {
            //Create worksheet
            Sheet sheet = workbook.createSheet(sheetName);

            CellStyle defaultHeaderStyle = getDefaultHeaderStyle(workbook);
            CellStyle defaultRowStyle = getDefaultRowStyle(workbook);

            //Create header row
            Row headerRow = sheet.createRow((short) 0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);

                if(columnWidth != null && columnWidth.length > i)
                    sheet.setColumnWidth(i, columnWidth[i] * 256);

                cell.setCellStyle(defaultHeaderStyle);
            }

            //Create rows data
            for (int i = 0; i < objects.length; i++) {
                //Create new row
                Row row = sheet.createRow(i + 1);

                for (int k = 0; k < propertyNames.length; k++) {

                    String val = "";
                    Object valueObject = BeanUtil.getPropertySilently(objects[i], propertyNames[k]);
                    if (valueObject != null) {
                        if (valueObject instanceof Date) {
                            SimpleDateFormat sdf =
                                    new SimpleDateFormat (DateUtil.ISO_DATE_FORMAT, RequestUtil.getCurrentLocale());
                            val = sdf.format(valueObject);
                        } else if (valueObject instanceof Double ) {
                            Double v = (Double) valueObject;
                            if (v == 0) {
                                val = "0";
                            } else {
                                val = v.toString();
                            }
                        } else {
                            val = valueObject.toString();
                        }
                    }
                    //Create cell
                    Cell cell = row.createCell(k);
                    cell.setCellValue(val);

                    cell.setCellStyle(defaultRowStyle);
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

    public static void export(OutputStream outputStream, String sheetName,
                              Object[] objects, String[] propertyNames, String[] headers) {
        export(outputStream, sheetName, objects, propertyNames, headers, null);
    }

    private static CellStyle getDefaultHeaderStyle(Workbook workbook) {
        Font font= workbook.createFont();
        font.setFontHeightInPoints((short) 10);
        font.setFontName("Arial");
        font.setColor(IndexedColors.WHITE.getIndex());
//        font.setBoldweight(Font.BOLDWEIGHT_BOLD);
        font.setItalic(false);

        CellStyle style = workbook.createCellStyle();
        style.setFillBackgroundColor(IndexedColors.DARK_BLUE.getIndex());
//        style.setFillPattern(CellStyle.SOLID_FOREGROUND);
//        style.setAlignment(CellStyle.ALIGN_CENTER);
        style.setFont(font);

        return style;
    }

    private static CellStyle getDefaultRowStyle(Workbook workbook) {
        Font font= workbook.createFont();
        font.setFontHeightInPoints((short) 10);
        font.setFontName("Arial");

        CellStyle style = workbook.createCellStyle();
        style.setFont(font);

        return style;
    }
}
