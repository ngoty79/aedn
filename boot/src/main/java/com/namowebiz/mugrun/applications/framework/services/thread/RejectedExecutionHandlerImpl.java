package com.namowebiz.mugrun.applications.framework.services.thread;

import lombok.extern.apachecommons.CommonsLog;

import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * User: Vinh
 * Date: 4/5/13
 * Time: 3:00 PM
 */
@CommonsLog
public class RejectedExecutionHandlerImpl implements RejectedExecutionHandler {

    @Override
    public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
        log.info(r.toString() + " is rejected");
    }

}
