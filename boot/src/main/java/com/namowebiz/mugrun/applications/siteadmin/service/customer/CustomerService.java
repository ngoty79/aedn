package com.namowebiz.mugrun.applications.siteadmin.service.customer;

import com.namowebiz.mugrun.applications.framework.common.utils.JsonResponse;
import com.namowebiz.mugrun.applications.siteadmin.dao.customer.CustomerDao;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.Customer;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.CustomerVO;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by asuspc on 9/14/2017.
 */
@Service
public class CustomerService {
    @Autowired
    private CustomerDao customerDao;
    @Autowired
    private LoanService loanService;


    public Customer getByPK(Long customerNo){
        return customerDao.getByPK(customerNo);
    }

    public void insert(Customer customer){
        customerDao.insert(customer);
    }

    public void update(Customer customer){
        customerDao.update(customer);
    }

    public void delete(Long customerNo){
        customerDao.delete(customerNo);
    }

    public List<CustomerVO> list(Map<String, Object> params){
        return customerDao.list(params);
    }

    public Long count(Map<String, Object> params){
        Long count = customerDao.count(params);
        return count == null? 0L : count;
    }

    @Transactional
    public void addOrEdit(Customer model, Long userNo){
        if(model.getCustomerNo() == null){
            model.setRegUserNo(userNo);
            model.setRegDate(new Date());
            model.setCustomerCode(getNextCustomerCode());
            insert(model);
        }else{
            Customer customer = getByPK(model.getCustomerNo());
            if(StringUtils.isEmpty(customer.getCustomerCode())){
                customer.setCustomerCode(getNextCustomerCode());
            }
            customer.setModUserNo(userNo);
            customer.setStaffUserNo(model.getStaffUserNo());
            customer.setName(model.getName());
            customer.setTownNo(model.getTownNo());
            customer.setPhone(model.getPhone());
            customer.setEmail(model.getEmail());
            customer.setSocialId(model.getSocialId());
            customer.setIssueDate(model.getIssueDate());
            customer.setIssuePlace(model.getIssuePlace());
            customer.setPassportNo(model.getPassportNo());
            customer.setAddress(model.getAddress());
            customer.setSubAddress(model.getSubAddress());
            customer.setModDate(new Date());
            customer.setBirthday(model.getBirthday());
            update(customer);
        }
    }

    @Transactional
    public JsonResponse deleteList(List<Long> customerNoList){
        JsonResponse jsonResponse = new JsonResponse(false, null);
        boolean valid = true;
        for (Long customerNo : customerNoList) {
            if(!canDelete(customerNo)){
                valid = false;
                Customer customer = getByPK(customerNo);
                jsonResponse.setSuccess(false);
                jsonResponse.setData(customer.getName());
                break;
            }
        }
        if(valid){
            for (Long customerNo : customerNoList) {
                delete(customerNo);
            }
            jsonResponse.setSuccess(valid);
        }

        return jsonResponse;
    }

    private boolean canDelete(Long customerNo){
        return !(loanService.getCountByCustomerNo(customerNo)>0);
    }

    public Customer getSummary(){
        return customerDao.getSummary();
    }

    public String getNextCustomerCode(){
        String prefixCode = "PQ16.";
        String customerCode = customerDao.getMaxCustomerCode();
        if(StringUtils.isEmpty(customerCode)){
            return prefixCode + "00001";
        }else{
            String value = customerCode.replace(prefixCode, "");
            value = StringUtils.stripStart(value, "0");
            int sequence = Integer.valueOf(value) + 1;
            String nextCode = prefixCode + StringUtils.leftPad(sequence + "", 5, "0");
            return nextCode;
        }
    }
}
