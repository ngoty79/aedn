package com.namowebiz.mugrun.applications.siteadmin.dao.customer;

import com.namowebiz.mugrun.applications.siteadmin.models.customer.Customer;
import com.namowebiz.mugrun.applications.siteadmin.models.customer.CustomerVO;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Created by asuspc on 9/14/2017.
 */
@Repository
public interface CustomerDao {
    Customer getByPK(Long customerNo);

    String getMaxCustomerCode();

    Customer getSummary();

    void insert(Customer customer);

    void update(Customer customer);

    void delete(Long customerNo);

    List<CustomerVO> list(Map<String, Object> params);

    public Long count(Map<String, Object> params);
}
