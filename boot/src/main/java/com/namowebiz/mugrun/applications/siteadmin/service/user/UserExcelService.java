package com.namowebiz.mugrun.applications.siteadmin.service.user;

import com.namowebiz.mugrun.applications.framework.common.utils.JsonResponse;
import com.namowebiz.mugrun.applications.framework.common.utils.PasswordUtil;
import com.namowebiz.mugrun.applications.siteadmin.models.user.UserDataExcels;
import com.namowebiz.mugrun.applications.siteadmin.models.user.UserInfoExcels;
import com.namowebiz.mugrun.applications.siteadmin.models.user.UserVO;
import lombok.extern.apachecommons.CommonsLog;
import org.apache.commons.lang.math.NumberUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.*;

/**
 * Created by Hai Nguyen on 6/26/2016.
 */
@Service
@CommonsLog
public class UserExcelService {

    @Autowired
    private PasswordUtil passwordUtil;

    @Autowired
    private UserService userService;

    private static final String COLUMN_USER_ID = "사용자아이디";
    private static final String COLUMN_USER_PASSWORD = "사용자비밀번호";
    private static final String COLUMN_USER_NAME = "사용자이름";
    private static final String COLUMN_USER_NICKNAME = "사용자별명";
    private static final String COLUMN_USER_EMAIL = "사용자이메일";
    private static final String COLUMN_USER_TEL = "사용자전화번호";
    private static final String COLUMN_USER_ZIPCODE = "우편번호";
    private static final String COLUMN_USER_ADDRESS = "주소";
    private static final String COLUMN_USER_SUB_ADDRESS = "보조주소";
    private static final String USER_STATUS_WAITING = "W";


    public void doExportUserList(OutputStream outputStream, List<UserVO> users) throws Exception {

        List<UserInfoExcels> userInfoExcelsList = new ArrayList<>();
        for (int i = 0; i < users.size(); i++) {
            UserVO userVO = users.get(i);
            List<UserDataExcels> userDataExcelsList = new ArrayList<>();
            userDataExcelsList.add(new UserDataExcels(COLUMN_USER_ID, userVO.getId()));
            userDataExcelsList.add(new UserDataExcels(COLUMN_USER_PASSWORD, userVO.getPassword()));
            userDataExcelsList.add(new UserDataExcels(COLUMN_USER_NAME, userVO.getName()));
            userDataExcelsList.add(new UserDataExcels(COLUMN_USER_NICKNAME, userVO.getNickname()));
            userDataExcelsList.add(new UserDataExcels(COLUMN_USER_EMAIL, userVO.getEmail()));
            userDataExcelsList.add(new UserDataExcels(COLUMN_USER_TEL, userVO.getTel()));
            userDataExcelsList.add(new UserDataExcels(COLUMN_USER_ZIPCODE, userVO.getZipcode()));
            userDataExcelsList.add(new UserDataExcels(COLUMN_USER_ADDRESS, userVO.getAddress()));
            userDataExcelsList.add(new UserDataExcels(COLUMN_USER_SUB_ADDRESS, userVO.getSubAddress()));
            UserInfoExcels userInfoExcels = new UserInfoExcels();
            userInfoExcels.setUserDataExcelses(userDataExcelsList);
            userInfoExcelsList.add(userInfoExcels);
        }

        List<String> headers = new ArrayList<>();
        headers.add("*" + COLUMN_USER_ID);
        headers.add("*" + COLUMN_USER_PASSWORD);
        headers.add("*" + COLUMN_USER_NAME);
        headers.add(COLUMN_USER_NICKNAME);
        headers.add("*" + COLUMN_USER_EMAIL);
        headers.add("*" + COLUMN_USER_TEL);
        headers.add(COLUMN_USER_ZIPCODE);
        headers.add(COLUMN_USER_ADDRESS);
        headers.add(COLUMN_USER_SUB_ADDRESS);

        try {
            writeExcel(outputStream, userInfoExcelsList, headers);
        } catch (FileNotFoundException e) {
            log.error(e.getMessage());
        } catch (IOException e) {
            log.error(e.getMessage());
        } finally {
            try {
                outputStream.close();
            } catch (IOException e) {
                log.error(e.getMessage());
            }
        }
    }

    private void writeExcel(OutputStream outputStream, List<UserInfoExcels> userInfoExcelsList, List<String> headers) throws IOException {
        Workbook workbook = new HSSFWorkbook();
        //create worksheet
        Sheet sheet = workbook.createSheet("Sheet1");

        CellStyle redCellStyle = workbook.createCellStyle();
        redCellStyle.setFillForegroundColor(IndexedColors.RED.getIndex());
//        redCellStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);

        CreationHelper createHelper = workbook.getCreationHelper();
        CellStyle textCellStyle = workbook.createCellStyle();
        textCellStyle.setDataFormat(createHelper.createDataFormat().getFormat("@"));

        Row headerRow = sheet.createRow((short) 0);
        for (int i = 0; i < headers.size(); i++) {
            Cell cell = headerRow.createCell(i);
            String text = headers.get(i);
            if (text.startsWith("*")) {
                cell.setCellStyle(redCellStyle);
                cell.setCellValue(text.substring(1));
            } else {
                cell.setCellValue(text);
            }
        }

        for (int i = 0; i < userInfoExcelsList.size(); i++) {
            Row row = sheet.createRow(i + 1);
            for (int j = 0; j < headers.size(); j++) {
                Cell cell = row.createCell(j);
                cell.setCellValue(userInfoExcelsList.get(i).getUserDataExcelses().get(j).getColumnData());
                cell.setCellStyle(textCellStyle);
            }
        }

        try {
            workbook.write(outputStream);
        } catch (IOException e) {
            log.error(e.getMessage(), e);
            throw new IOException(e);
        } finally {
            try {
                workbook.close();
            } catch (IOException e) {
                log.error(e.getMessage(), e);
            }
        }
    }

    public void doImport(InputStream inputStream, Long userCreateNo, JsonResponse jsonResponse) throws Exception {
        List<UserVO> userVOList = new ArrayList<>();

        Workbook workbook = WorkbookFactory.create(inputStream);

        Sheet sheet = workbook.getSheetAt(0);
        for (Row row : sheet) {
            int rowNum = row.getRowNum();
            if (rowNum != 0) {
                String password = getValueCellByIndex(row, 1);
                boolean passwordPattern = passwordUtil.isPasswordPattern(password);
                if(!passwordPattern) {
                    jsonResponse.addError("password", password);
                    return;
                }
                String id = getValueCellByIndex(row, 0);
                UserVO userId = userService.getByUserId(id);
                if (userId != null) {
                    jsonResponse.addError("id", id);
                    return;
                }

                String nickname = getValueCellByIndex(row, 3);
                Map<String, Object> params = new HashMap<>();
                params.put("nickname", nickname);
                List<UserVO> list = userService.list(params);
                if(list.size() > 0){
                    jsonResponse.addError("nickname", nickname);
                    return;
                }

                String tel = getValueCellByIndex(row, 5);
                boolean number = NumberUtils.isNumber(tel);
                if(!number){
                    jsonResponse.addError("telNotNumber", tel);
                    return;
                }

                if(tel.length() != 11){
                    jsonResponse.addError("telNotValid", tel);
                    return;
                }

                String email = getValueCellByIndex(row, 4);
                if(!email.contains("@")){
                    jsonResponse.addError("email", email);
                    return;
                }

                String tel1 = tel.substring(0, 3);
                String tel2 = tel.substring(3, 7);
                String tel3 = tel.substring(7, 11);
                String formatTel = tel1 + "-" + tel2 + "-" + tel3;

                UserVO userVO = new UserVO();
                userVO.setId(id);
                userVO.setPassword(passwordUtil.encodePassword(getValueCellByIndex(row, 1)));
                userVO.setPasswordModDate(new Date());
                userVO.setName(getValueCellByIndex(row, 2));
                userVO.setNickname(nickname);
                userVO.setEmail(email);
                userVO.setTel(formatTel);
                userVO.setZipcode(getValueCellByIndex(row, 6));
                userVO.setAddress(getValueCellByIndex(row, 7));
                userVO.setSubAddress(getValueCellByIndex(row, 8));
                userVO.setUserStatus(USER_STATUS_WAITING);
                userVO.setAdminYn(false);
                userVO.setRegUserNo(userCreateNo);
                userVO.setModUserNo(userCreateNo);
                userVOList.add(userVO);
            }
        }
        log.info(userVOList);
        doImportDB(userVOList);
    }

    private String getValueCellByIndex(Row row, int index) {
        Cell cell = row.getCell(index);
//        cell.setCellType(Cell.CELL_TYPE_STRING);
        //return cell.getRichStringCellValue().getString();
        return cell.getStringCellValue();
    }

    public void doImportDB(List<UserVO> userVOList){
        for (UserVO userVO : userVOList){
            userService.insert(userVO);
        }
    }
}
