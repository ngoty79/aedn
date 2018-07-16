package com.namowebiz.mugrun.applications.framework.services.thread;


import lombok.extern.apachecommons.CommonsLog;

import java.util.concurrent.ThreadPoolExecutor;

/**
 * User: Vinh
 * Date: 4/5/13
 * Time: 2:45 PM
 */
@CommonsLog
public class ThreadPoolMonitor implements Runnable {
    private ThreadPoolExecutor executor;
    private int seconds;
    private boolean run = true;

    public ThreadPoolMonitor(ThreadPoolExecutor executor, int delaySeconds) {
        this.executor = executor;
        this.seconds = delaySeconds;
    }

    public void shutdown() {
        this.run = false;
    }

    @Override
    public void run() {
        while (run) {
            log.info(
                    String.format("[monitor] [%d/%d] Active: %d, Completed: %d, Task: %d, isShutdown: %s, isTerminated: %s",
                            this.executor.getPoolSize(),
                            this.executor.getCorePoolSize(),
                            this.executor.getActiveCount(),
                            this.executor.getCompletedTaskCount(),
                            this.executor.getTaskCount(),
                            this.executor.isShutdown(),
                            this.executor.isTerminated()));
            try {
                Thread.sleep(seconds * 1000);
            } catch (InterruptedException e) {
                log.error(e.getMessage(),e);
            }
        }

    }
}
