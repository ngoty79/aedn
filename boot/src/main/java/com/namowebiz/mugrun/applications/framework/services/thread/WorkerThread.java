package com.namowebiz.mugrun.applications.framework.services.thread;

import lombok.extern.apachecommons.CommonsLog;

/**
 * User: Vinh
 * Date: 4/5/13
 * Time: 2:50 PM
 */
@CommonsLog
public class WorkerThread implements Runnable {
    private String command;

    public WorkerThread(String s) {
        this.command = s;
    }

    @Override
    public void run() {
        processCommand();
    }

    private void processCommand() {
        try {
            log.info(Thread.currentThread().getName() + " Started - " + command);
            Thread.sleep(5000);
            log.info(Thread.currentThread().getName() + " End.");
        } catch (InterruptedException e) {
        	log.error(e.getMessage(),e);
        }
    }

    @Override
    public String toString() {
        return this.command;
    }
}
