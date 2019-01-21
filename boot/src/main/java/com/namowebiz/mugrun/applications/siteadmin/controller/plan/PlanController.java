package com.namowebiz.mugrun.applications.siteadmin.controller.plan;

import com.namowebiz.mugrun.applications.framework.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.framework.common.utils.PaginationList;
import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.LoanVO;
import com.namowebiz.mugrun.applications.siteadmin.models.report.ReportData;
import com.namowebiz.mugrun.applications.siteadmin.models.report.ReportView;
import com.namowebiz.mugrun.applications.siteadmin.models.user.UserVO;
import com.namowebiz.mugrun.applications.siteadmin.models.usergroup.UserGroup;
import com.namowebiz.mugrun.applications.siteadmin.service.common.FileService;
import com.namowebiz.mugrun.applications.siteadmin.service.customer.LoanService;
import com.namowebiz.mugrun.applications.siteadmin.service.user.UserService;
import lombok.extern.apachecommons.CommonsLog;
import org.apache.commons.lang.StringUtils;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by ASUS on 12/27/2018.
 */
@Controller
@CommonsLog
public class PlanController {
    @Autowired
    private UserService userService;
    @Autowired
    private LoanService loanService;
    @Autowired
    private FileService fileService;

    @RequestMapping(value = "/admin/plan/index", method = RequestMethod.GET)
    public String index(Map<String, Object> map, HttpServletRequest request) throws Exception {
        Map<String, Object> params = new HashMap<>();
        params.clear();
        params.put("adminYn", 0);
        map.put("userList", userService.list(params));
        return "siteadmin/plan/index";
    }


    @RequestMapping(value = "/admin/plan/pagination.json", method = RequestMethod.GET)
    @ResponseBody
    public PaginationList<LoanVO> pagination(HttpServletRequest request, Long userNo,
                                             @DateTimeFormat(pattern="dd/MM/yyyy") Date startDate,
                                             @DateTimeFormat(pattern="dd/MM/yyyy") Date endDate) throws Exception {

        Map<String, Object> params = new HashMap<>();
        params.put("staffUserNo", userNo);
        if(startDate != null){
            params.put("startDate", startDate);
        }
        if(endDate != null){
            params.put("endDate", endDate);
        }
        PaginationList<LoanVO> paging = new PaginationList<>(1, 1000);

        List<LoanVO> loans = loanService.getLoanPlan(params);
        paging.setRows(loans);
        return paging;
    }


    @RequestMapping(value = "/admin/plan/download", method = RequestMethod.GET)
    public void download(HttpServletResponse response, Long userNo,
                                             @DateTimeFormat(pattern="dd/MM/yyyy") Date startDate,
                                             @DateTimeFormat(pattern="dd/MM/yyyy") Date endDate) throws Exception {
        response.setContentType("application/vnd.ms-excel");
        response.addHeader("Content-Disposition", "attachment; filename=duthu.xlsx");
        Map<String, Object> params = new HashMap<>();
        params.put("staffUserNo", userNo);
        if(startDate != null){
            params.put("startDate", startDate);
        }
        if(endDate != null){
            params.put("endDate", endDate);
        }
        List<LoanVO> loans = loanService.getLoanPlan(params);
        this.export(response.getOutputStream(), loans);
    }

    private void export(OutputStream outputStream, List<LoanVO> loans) {
        Workbook workbook = null;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/YYYY");
            String filePath = fileService.getBasePath("files/duthu.xlsx");
            workbook = new XSSFWorkbook( OPCPackage.open(filePath) );
            CellStyle cellStyle = workbook.createCellStyle();
            cellStyle.setAlignment(HorizontalAlignment.CENTER);

            CellStyle cellStyleRight = workbook.createCellStyle();
            cellStyleRight.setAlignment(HorizontalAlignment.RIGHT);
            Sheet sheet = workbook.getSheetAt(0);
            int lastRowNum = sheet.getLastRowNum();

            for (int i = 3; i <= lastRowNum ; i++) {
                Row r = sheet.getRow(i);
                if(r != null){
                    sheet.removeRow(r);
                }
            }

            int startRowIndex = 3;
            for (int i = 0; i < loans.size(); i++) {
                LoanVO data = loans.get(i);
                Row row = sheet.createRow(startRowIndex + i);
                Cell cellNV = row.createCell(0);
                cellNV.setCellValue(data.getStaffUserName());

                Cell cellContractCode = row.createCell(1);
                cellContractCode.setCellStyle(cellStyle);
                cellContractCode.setCellValue(data.getContractCode());

                Cell cellCustomerCode = row.createCell(2);
                cellCustomerCode.setCellStyle(cellStyle);
                cellCustomerCode.setCellValue(data.getCustomerCode());

                Cell cellCustomerName = row.createCell(3);
                cellCustomerName.setCellValue(data.getCustomerName());

                Cell cLoanAmountFormat = row.createCell(4);
                cLoanAmountFormat.setCellStyle(cellStyleRight);
                cLoanAmountFormat.setCellValue(data.getLoanAmountFormat());

                Cell cDebtFormat = row.createCell(5);
                cDebtFormat.setCellStyle(cellStyleRight);
                cDebtFormat.setCellValue(data.getCurrentDebtFormat());

                Cell cLoanStartDate = row.createCell(6);
                cLoanStartDate.setCellStyle(cellStyle);
                cLoanStartDate.setCellValue(sdf.format(data.getStartDate()));

                Cell cLoanEndDate = row.createCell(7);
                cLoanEndDate.setCellStyle(cellStyle);
                cLoanEndDate.setCellValue(sdf.format(data.getEndDate()));

                Cell cDelayDay = row.createCell(8);
                cDelayDay.setCellStyle(cellStyle);
                cDelayDay.setCellValue(data.getDelayDays());

                Cell cDay = row.createCell(9);
                cDay.setCellStyle(cellStyle);
                cDay.setCellValue(data.getEstimateDays());

                Cell cTotal = row.createCell(10);
                int total = data.getDelayDays() + data.getEstimateDays();
                cTotal.setCellStyle(cellStyle);
                cTotal.setCellValue(total);
            }

            workbook.write(outputStream);
        } catch (FileNotFoundException e) {
            log.error(e.getMessage(), e);
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        } catch (InvalidFormatException e) {
            e.printStackTrace();
        } finally {
            try {
                if(workbook != null){
                    outputStream.close();
                    workbook.close();
                }

            } catch (IOException e) {
                log.error(e.getMessage(), e);
            }
        }
    }

}
