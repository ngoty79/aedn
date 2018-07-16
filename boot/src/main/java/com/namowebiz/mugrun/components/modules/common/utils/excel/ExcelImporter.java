package com.namowebiz.mugrun.components.modules.common.utils.excel;

import com.extentech.ExtenXLS.CellHandle;
import com.extentech.ExtenXLS.RowHandle;
import com.extentech.ExtenXLS.WorkBookHandle;
import com.extentech.ExtenXLS.WorkSheetHandle;
import com.extentech.formats.XLS.WorkSheetNotFoundException;
import com.extentech.formats.XLS.XLSConstants;
import jodd.bean.BeanUtil;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: vlqhai
 * Date: 8/23/12
 * Time: 9:51 AM
 */
public class ExcelImporter {

    @SuppressWarnings("unchecked")
    public static <T> T[] doImport(InputStream inputStream, int sheetIndex, int startLine, Class<T> clazz, String[] properties) throws IllegalAccessException, InstantiationException, IOException, WorkSheetNotFoundException {
        List<T> dataList = new ArrayList<T>(100);
        WorkBookHandle workbook = new WorkBookHandle(inputStream);
        WorkSheetHandle sheet = workbook.getWorkSheet(sheetIndex);
        for (RowHandle row : sheet.getRows()) {
            if (row.getRowNumber() < startLine) {
                continue;
            }
            T t = clazz.newInstance();
            boolean hasData = false;
            for (CellHandle cell : row.getCells()) {
                if (cell.getColNum() < properties.length && properties[cell.getColNum()] != null) {
                    switch (cell.getCellType()) {
                        case XLSConstants.TYPE_INT:
                            BeanUtil.setPropertySilent(t, properties[cell.getColNum()], cell.getIntVal());
                            break;
                        case XLSConstants.TYPE_DOUBLE:
                            BeanUtil.setPropertySilent(t, properties[cell.getColNum()], cell.getDoubleVal());
                            break;
                        case XLSConstants.TYPE_FP:
                            BeanUtil.setPropertySilent(t, properties[cell.getColNum()], cell.getFloatVal());
                            break;
                        case XLSConstants.TYPE_STRING:
                            BeanUtil.setPropertySilent(t, properties[cell.getColNum()], cell.getStringVal());
                            break;
                        case XLSConstants.TYPE_BOOLEAN:
                            BeanUtil.setPropertySilent(t, properties[cell.getColNum()], cell.getBooleanVal());
                            break;
                        default:
                            break;
                    }
                    if(!cell.isBlank()) {
                        hasData = true;
                    }
                }
            }
            if(hasData) {
                dataList.add(t);
            }
        }

        return dataList.toArray((T[]) Array.newInstance(clazz, dataList.size()));
    }
}
