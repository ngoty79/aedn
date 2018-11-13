package com.namowebiz.mugrun.applications.siteadmin.service.report;


import com.namowebiz.mugrun.applications.siteadmin.models.report.ReportData;
import com.namowebiz.mugrun.applications.siteadmin.models.report.ReportView;
import com.namowebiz.mugrun.applications.siteadmin.service.common.FileService;
import jodd.bean.BeanUtil;
import jodd.typeconverter.TypeConverterManager;
import lombok.extern.apachecommons.CommonsLog;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

@Service
@CommonsLog
public class ReportExcelService {
    @Autowired
    private FileService fileService;

    public void export(OutputStream outputStream, int month, List<ReportView> reports, List<ReportData> revenueList) {
        Workbook workbook = null;
        try {
            String filePath = fileService.getBasePath("files/report" + month + "m.xlsx");
            workbook = new XSSFWorkbook( OPCPackage.open(filePath) );
            Sheet sheet = workbook.getSheetAt(0);
            Row headerRow = sheet.getRow(4);
            Row rowThuLai = sheet.getRow(5);
            Row rowTienLe = sheet.getRow(6);
            Row rowPhiHs = sheet.getRow(7);
            Row rowThuKhac = sheet.getRow(8);
            Row rowLaiGoiNH = sheet.getRow(9);
            Row rowTongThu = sheet.getRow(10);

            Row rowVPPham = sheet.getRow(12);
            Row rowPhiRutTien = sheet.getRow(13);
            Row rowLuong = sheet.getRow(14);
            Row rowThuong = sheet.getRow(15);
            Row rowLuongT13 = sheet.getRow(16);
            Row rowChiKhac = sheet.getRow(17);
            Row rowTraLai = sheet.getRow(18);
            Row rowChiHoatDong = sheet.getRow(19);
            Row rowGiamLai = sheet.getRow(20);
            Row rowSinhNhat = sheet.getRow(21);
            Row rowDongPhu = sheet.getRow(22);
            Row rowBaoHiem = sheet.getRow(23);
            Row rowTienXang = sheet.getRow(24);
            Row rowCardDt = sheet.getRow(25);
            Row rowTongChi = sheet.getRow(26);
            Row rowLoiNhuan = sheet.getRow(27);
            for (int i = 0; i < reports.size(); i++) {
                Cell headerCell = headerRow.getCell(i + 1);
                headerCell.setCellValue(reports.get(i).getMonthYear());
                Cell cellThuLai = rowThuLai.getCell(i + 1);
                cellThuLai.setCellValue(reports.get(i).getLoanProfit());
                Cell cellTienLei = rowTienLe.getCell(i + 1);
                cellTienLei.setCellValue(reports.get(i).getCash());
                Cell cellPhiHS = rowPhiHs.getCell(i + 1);
                cellPhiHS.setCellValue(reports.get(i).getProfileCost());
                Cell cellThuKhac = rowThuKhac.getCell(i + 1);
                cellThuKhac.setCellValue(reports.get(i).getOtherRevenue());
                Cell cellLaiGoiNH = rowLaiGoiNH.getCell(i + 1);
                cellLaiGoiNH.setCellValue(reports.get(i).getBankInterest());
                Cell cellTongThu = rowTongThu.getCell(i + 1);
                cellTongThu.setCellValue(reports.get(i).getTotalRevenue());

                Cell cellVPPham = rowVPPham.getCell(i + 1);
                cellVPPham.setCellValue(reports.get(i).getOfficeStuff());
                Cell cellPhiRutTien = rowPhiRutTien.getCell(i + 1);
                cellPhiRutTien.setCellValue(reports.get(i).getWithdrawFee());
                Cell cellLuong = rowLuong.getCell(i + 1);
                cellLuong.setCellValue(reports.get(i).getSalary());
                Cell cellLuongT13 = rowLuongT13.getCell(i + 1);
                cellLuongT13.setCellValue(reports.get(i).getSalary13th());
                Cell cellThuong = rowThuong.getCell(i + 1);
                cellThuong.setCellValue(reports.get(i).getBonus());
                Cell cellChiKhac = rowChiKhac.getCell(i + 1);
                cellChiKhac.setCellValue(reports.get(i).getOtherCost());
                Cell cellTraLai = rowTraLai.getCell(i + 1);
                cellTraLai.setCellValue(reports.get(i).getInterestCost());
//                cellTraLai.setCellValue(reports.get(i).getInsuranceCost());
                Cell cellChiHoatDong = rowChiHoatDong.getCell(i + 1);
                cellChiHoatDong.setCellValue(reports.get(i).getOperatingCost());
                Cell cellGiamLai = rowGiamLai.getCell(i + 1);
                cellGiamLai.setCellValue(reports.get(i).getGiamLai());

                Cell cellSinhNhat = rowSinhNhat.getCell(i + 1);
                cellSinhNhat.setCellValue(reports.get(i).getBirthdayCost());

                Cell cellDongPhuc = rowDongPhu.getCell(i + 1);
                cellDongPhuc.setCellValue(reports.get(i).getUniformCost());

                Cell cellBaoHiem = rowBaoHiem.getCell(i + 1);
                cellBaoHiem.setCellValue(reports.get(i).getInsuranceCost());

                Cell cellTienXang = rowTienXang.getCell(i + 1);
                cellTienXang.setCellValue(reports.get(i).getOilCost());

                Cell cellCardDT = rowCardDt.getCell(i + 1);
                cellCardDT.setCellValue(reports.get(i).getTelCardCost());

                Cell cellTongChi = rowTongChi.getCell(i + 1);
                cellTongChi.setCellValue(reports.get(i).getTotalCost());

                Cell cellLoiNhuan = rowLoiNhuan.getCell(i + 1);
                cellLoiNhuan.setCellValue(reports.get(i).getTotalRevenue() - reports.get(i).getTotalCost());

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
