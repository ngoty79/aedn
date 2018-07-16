package com.namowebiz.mugrun.applications.siteadmin.models.usergroup;

import com.namowebiz.mugrun.applications.siteadmin.common.data.GenericVO;
import lombok.Getter;
import lombok.Setter;

/**
 * UserGroupUser
 * 
 * @author Vinh
 * @since 1.0
 */
@Getter
@Setter
@SuppressWarnings("PMD.UnusedPrivateField")
public class UserGroupUsers extends GenericVO {

    private static final long serialVersionUID = 4700142191466080867L;

    @Getter @Setter
    private Long userGroupNo;
    @Getter @Setter
    private Long userNo;

}
