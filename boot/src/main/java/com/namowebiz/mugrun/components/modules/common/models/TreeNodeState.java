package com.namowebiz.mugrun.components.modules.common.models;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by datnguyen on 9/12/2016.
 */
@Getter @Setter
@SuppressWarnings("PMD.UnusedPrivateField")
public class TreeNodeState {
    @Getter @Setter
    private Boolean selected;
    @Getter @Setter
    private Boolean opened;
    @Getter @Setter
    private Boolean disabled;
    @Getter @Setter
    private Boolean checked;
    @Getter @Setter
    private Boolean undetermined;
}
