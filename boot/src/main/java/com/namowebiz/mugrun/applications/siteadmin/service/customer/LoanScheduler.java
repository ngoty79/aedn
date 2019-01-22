package com.namowebiz.mugrun.applications.siteadmin.service.customer;

import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;


@Service
@CommonsLog
public class LoanScheduler {
    @Autowired
    private LoanService loanService;

    @Scheduled(cron = "0 0 */3 * * *")
    public void scheduledCollect() throws IOException {
        loanService.updateIsPaidAll();
    }
}
