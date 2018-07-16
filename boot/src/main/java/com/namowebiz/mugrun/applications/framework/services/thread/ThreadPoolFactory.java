package com.namowebiz.mugrun.applications.framework.services.thread;

import org.springframework.stereotype.Component;

/**
 * User: Vinh
 * Date: 4/5/13
 * Time: 5:19 PM
 */
@Component
public class ThreadPoolFactory {
    private int corePoolSize;
    private int maximumPoolSize;
    private long keepAliveSeconds;
    private int queueSize;
    private boolean monitoringEnabled;
    private int monitoringSeconds;

//    public static void main(String[] args) {
//        ThreadPoolFactory threadPoolFactory = new ThreadPoolFactory();
//        threadPoolFactory.setCorePoolSize(5);
//        threadPoolFactory.setMaximumPoolSize(10);
//        threadPoolFactory.setKeepAliveSeconds(60);
//        threadPoolFactory.setMonitoringSeconds(3);
//        threadPoolFactory.setQueueSize(100);
//        ThreadPool threadPool = threadPoolFactory.createThreadPool();
//        for (int i = 0; i < 10; i++) {
//            threadPool.execute(new WorkerThread("Worker-" + i));
//        }
//        threadPool.shutdown();
//
//    }

    public int getCorePoolSize() {
        return corePoolSize;
    }

    public void setCorePoolSize(int corePoolSize) {
        this.corePoolSize = corePoolSize;
    }

    public int getMaximumPoolSize() {
        return maximumPoolSize;
    }

    public void setMaximumPoolSize(int maximumPoolSize) {
        this.maximumPoolSize = maximumPoolSize;
    }

    public long getKeepAliveSeconds() {
        return keepAliveSeconds;
    }

    public void setKeepAliveSeconds(long keepAliveSeconds) {
        this.keepAliveSeconds = keepAliveSeconds;
    }

    public int getQueueSize() {
        return queueSize;
    }

    public void setQueueSize(int queueSize) {
        this.queueSize = queueSize;
    }

    public int getMonitoringSeconds() {
        return monitoringSeconds;
    }

    public void setMonitoringSeconds(int monitoringSeconds) {
        this.monitoringSeconds = monitoringSeconds;
    }

    public ThreadPool createThreadPool() {
        return new ThreadPool(corePoolSize, maximumPoolSize, keepAliveSeconds, queueSize, monitoringEnabled, monitoringSeconds);
    }

    public boolean isMonitoringEnabled() {
        return monitoringEnabled;
    }

    public void setMonitoringEnabled(boolean monitoringEnabled) {
        this.monitoringEnabled = monitoringEnabled;
    }
}
