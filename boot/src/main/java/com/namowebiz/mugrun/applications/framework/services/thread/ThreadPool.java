package com.namowebiz.mugrun.applications.framework.services.thread;

import java.util.concurrent.*;

/**
 * User: Vinh
 * Date: 4/5/13
 * Time: 2:48 PM
 */
public class ThreadPool {
    private ThreadPoolExecutor executor = null;
    private ThreadPoolMonitor monitor = null;

    public ThreadPool(int corePoolSize, int maximumPoolSize, long keepAliveSeconds, int queueSize, boolean monitoringEnabled, int monitoringSeconds) {
        //RejectedExecutionHandler implementation
        //RejectedExecutionHandlerImpl rejectionHandler = new RejectedExecutionHandlerImpl();

        //Get the ThreadFactory implementation to use
        ThreadFactory threadFactory = Executors.defaultThreadFactory();

        //creating the ThreadPoolExecutor
        executor = new ThreadPoolExecutor(corePoolSize, maximumPoolSize, keepAliveSeconds, TimeUnit.SECONDS, new ArrayBlockingQueue<Runnable>(queueSize), threadFactory);
        executor.allowCoreThreadTimeOut(true);

        //Start the monitoring thread
        if (monitoringEnabled) {
            monitor = new ThreadPoolMonitor(executor, monitoringSeconds);
            new Thread(monitor).start();
        }
    }

    /**
     * Execute a thread using the thread pool
     * @param thread
     */
    public void execute(Runnable thread) {
        executor.execute(thread);
    }

    /**
     * Wait for all running threads to be completed
     * @return
     * @throws InterruptedException
     */
    public boolean awaitTermination() throws InterruptedException {
        return executor.awaitTermination(60, TimeUnit.SECONDS);
    }

    // Signal to shutdown the thread pool, keep all running threads until they requestFinish.
    public void shutdown() {
        //Shut down the pool
        executor.shutdown();

        //Shut down the monitor thread
        if (monitor != null) {
            monitor.shutdown();
        }
    }
}