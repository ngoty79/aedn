package com.namowebiz.mugrun.applications.siteadmin.models.customer;

import com.namowebiz.mugrun.applications.framework.models.BaseObject;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by asuspc on 10/3/2017.
 */
@Getter @Setter
public class LoanPayment extends BaseObject {
    public static final String STATUS_REQUEST = "R";
    public static final String STATUS_APPROVE = "A";
    private Long paymentNo;
    private Long loanNo;
    private String detailNoList;
    private String status;
    private Integer amount;


}
