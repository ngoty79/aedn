package com.namowebiz.mugrun.components.modules.common.models;

import lombok.Getter;
import lombok.Setter;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by datnguyen on 9/12/2016.
 */
@Getter @Setter
@SuppressWarnings("PMD.UnusedPrivateField")
public class TreeNode<T> {
    @Getter @Setter
    private String id;
    @Getter @Setter
    private String text;
    @Getter @Setter
    private boolean leaf = false;
    @Getter @Setter
    private Boolean selected;
    @Getter @Setter
    private Boolean opened = true;
    @Getter @Setter
    private Boolean disabled;
    @Getter @Setter
    private Boolean checked;
    @Getter @Setter
    private Boolean undetermined;
    @Getter @Setter
    private TreeNodeState state;
    @Getter @Setter
    private List<TreeNode> children = new ArrayList<>();
    @Getter @Setter
    private T modal;

    public TreeNode(String id, String text) {
        this.id = id;
        this.text = text;
    }

    public TreeNode(String nodeId, String nodeText, T modal) {
        try {
            Field field = modal.getClass().getDeclaredField(nodeId);
            field.setAccessible(true);
            this.modal = modal;

            Object idValue = getFieldValue(nodeId, modal);
            if(idValue != null) {
                this.id = idValue.toString();
            }

            Object textValue = getFieldValue(nodeText, modal);
            if(textValue != null) {
                this.text = textValue.toString();
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public TreeNodeState getState() {
        if(state == null) {
            state = new TreeNodeState();
            state.setOpened(getOpened());
            state.setChecked(getChecked());
            state.setDisabled(getDisabled());
            state.setSelected(getSelected());
            state.setUndetermined(getUndetermined());
        }
        return state;
    }

    public void setState(TreeNodeState state) {
        this.state = state;
    }

    private Object getFieldValue(String fieldName, T modal) {
        try {
            Field field = modal.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            return field.get(modal);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
