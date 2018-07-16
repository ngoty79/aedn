package com.namowebiz.mugrun.applications.siteadmin.common.data;

import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("serial")
public class GenericTreeVO<C> extends GenericVO{

    private String id;
    private String parentId;
    private String text;
    private boolean leaf;
    private boolean expanded;
    private String cls;
    private String iconCls;
    private List<C> children;
    private String url;
    private boolean allowDrag = true;
    private boolean allowDrop = true;
    private String parentName;
    private String qtip;

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public String getIconCls() {
		return iconCls;
	}
	public void setIconCls(String iconCls) {
		this.iconCls = iconCls;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getParentId() {
	    return parentId;
	}
	public void setParentId(String parentId) {
	    this.parentId = parentId;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public boolean isLeaf() {
		return leaf;
	}
	public void setLeaf(boolean leaf) {
		this.leaf = leaf;
	}
	
	public boolean isExpanded() {
        return expanded;
    }
    public void setExpanded(boolean expanded) {
        this.expanded = expanded;
    }
    
    public String getCls() {
		return cls;
	}
	public void setCls(String cls) {
		this.cls = cls;
	}

	public List<C> getChildren() {
	    if (this.children==null) this.children = new ArrayList<C>();
		return children;
	}
	
	public void setChildren(List<C> children) {
		this.children = children;
	}
    public String getUrl() {
        return url;
    }
    public void setUrl(String url) {
        this.url = url;
    }
	public boolean isAllowDrop() {
		return allowDrop;
	}
	public void setAllowDrop(boolean allowDrop) {
		this.allowDrop = allowDrop;
	}
	public boolean isAllowDrag() {
		return allowDrag;
	}
	public void setAllowDrag(boolean allowDrag) {
		this.allowDrag = allowDrag;
	}

    public String getQtip() {
        return qtip;
    }

    public void setQtip(String qtip) {
        this.qtip = qtip;
    }
}
