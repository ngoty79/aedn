package com.namowebiz.mugrun.applications.framework.common.utils;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class JsonResponse implements Serializable {
    private boolean success;
    private Object data;
    private long totalCount;
    private String messages;
    private Map<String, List<String>> errors;
    private String status;

    public JsonResponse() {
        this(true, null);
    }

    public JsonResponse(BindingResult bindingResult) {
        this(true, null);
        this.addErrors(bindingResult);
    }

    public JsonResponse(boolean success, Object data) {
        this.success = success;
        this.data = data;
        this.errors = new LinkedHashMap<String, List<String>>();
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public String getMessages() {
        return messages;
    }

    public void setMessages(String messages) {
        this.messages = messages;
    }

    public Map<String, List<String>> getErrors() {
        return errors;
    }

    public void setErrors(Map<String, List<String>> errors) {
        this.errors = errors;
        if (errors.size() > 0) {
            this.setSuccess(false);
        }
    }

    public void addError(String key, String error) {
        this.setSuccess(false);
        List<String> errorList = this.errors.get(key);
        if (errorList == null) {
            errorList = new ArrayList<String>();
            this.errors.put(key, errorList);
        }
        errorList.add(error);
    }

    public void addErrors(BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            for (FieldError fieldError : bindingResult.getFieldErrors()) {
                addError(fieldError.getField(), fieldError.getDefaultMessage());
            }
        }
    }



    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setTotalCount(long totalCount) {
        this.totalCount = totalCount;
    }

    public long getTotalCount() {
        return this.totalCount;
    }

}
