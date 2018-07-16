package com.namowebiz.mugrun.components.modules.signup.models;

import com.namowebiz.mugrun.applications.framework.models.BaseObject;
import lombok.Getter;
import lombok.Setter;

/**
 * Model
 * @author 
 * @since 2.6
 */
public class ModuleSignupProvision extends BaseObject{
	public static final String AGREEMENT_TYPE = "A";
	public static final String INSTRUCTION_TYPE = "I";
	public static final String JOIN_COMPLETE = "C";

	private Long provisionNo;
	private Long moduleNo;
	private String provisionName;
	private String provisionContent;
	private Integer baseAgreementYn;
	private Integer viewOrder;
	private Integer useYn;
	@Setter @Getter
	private Integer indispensableYn;
	private String provisionType;
	

	private boolean leaf= true;
	
	
	
	public boolean getLeaf() {
		return leaf;
	}
	public void setLeaf(boolean leaf) {
		this.leaf = leaf;
	}
	public long getId() {
		return provisionNo.longValue();
	}

	public String getText() {
		return provisionName;
	}

	public Long getProvisionNo() {
		return provisionNo;
	}
	public void setProvisionNo(Long provisionNo) {
		this.provisionNo = provisionNo;
	}
	public Long getModuleNo() {
		return moduleNo;
	}
	public void setModuleNo(Long moduleNo) {
		this.moduleNo = moduleNo;
	}
	public String getProvisionName() {
		return provisionName;
	}
	public void setProvisionName(String provisionName) {
		this.provisionName = provisionName;
	}
	public String getProvisionContent() {
		return provisionContent;
	}
	public void setProvisionContent(String provisionContent) {
		this.provisionContent = provisionContent;
	}
	public Integer getBaseAgreementYn() {
		return baseAgreementYn;
	}
	public void setBaseAgreementYn(Integer baseAgreementYn) {
		this.baseAgreementYn = baseAgreementYn;
	}
	public Integer getViewOrder() {
		return viewOrder;
	}
	public void setViewOrder(Integer viewOrder) {
		this.viewOrder = viewOrder;
	}
	public Integer getUseYn() {
		return useYn;
	}
	public void setUseYn(Integer useYn) {
		this.useYn = useYn;
	}
	public String getProvisionType() {
		return provisionType;
	}
	public void setProvisionType(String provisionType) {
		this.provisionType = provisionType;
	}

}
