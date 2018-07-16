package com.namowebiz.mugrun.applications.framework.core.thymeleaf.processor;

import com.namowebiz.mugrun.applications.framework.common.data.CommonConstants;
import com.namowebiz.mugrun.applications.framework.common.utils.JsonUtil;
import com.namowebiz.mugrun.applications.framework.common.utils.RequestUtil;
import com.namowebiz.mugrun.applications.framework.helper.BeanUtil;
import com.namowebiz.mugrun.applications.framework.services.component.control.AbstractComponentControl;
import com.namowebiz.mugrun.applications.framework.services.component.data.ComponentResultModel;
import com.namowebiz.mugrun.applications.siteadmin.models.user.UserVO;
import jodd.util.StringUtil;
import lombok.extern.apachecommons.CommonsLog;
import org.thymeleaf.IEngineConfiguration;
import org.thymeleaf.context.ITemplateContext;
import org.thymeleaf.context.IWebContext;
import org.thymeleaf.engine.AttributeName;
import org.thymeleaf.exceptions.TemplateProcessingException;
import org.thymeleaf.model.IProcessableElementTag;
import org.thymeleaf.processor.element.AbstractAttributeTagProcessor;
import org.thymeleaf.processor.element.IElementTagStructureHandler;
import org.thymeleaf.standard.StandardDialect;
import org.thymeleaf.templatemode.TemplateMode;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by ngo.ty on 6/24/2016.
 */
@CommonsLog
public class ComponentControlProcessor extends AbstractAttributeTagProcessor {
    public static final int PRECEDENCE = StandardDialect.PROCESSOR_PRECEDENCE;
    public static final String SCENE_NAME = "scene";
    public static final String ATTR_NAME = "type";
    public static final String DEFAULT_SCENE = "index";


    public ComponentControlProcessor(final String dialectPrefix) {
        super(TemplateMode.HTML, dialectPrefix, null, false, ATTR_NAME, true, PRECEDENCE, true);
    }

    @Override
    protected void doProcess(
            final ITemplateContext context,
            final IProcessableElementTag tag,
            final AttributeName attributeName, final String attributeValue,
            final IElementTagStructureHandler structureHandler) {
        final IEngineConfiguration configuration = context.getConfiguration();

        if(ProcessorConstants.MODULE_COMPONENT.equals(attributeValue)){
            doModuleProcess(context, tag, attributeName, attributeValue, ProcessorConstants.MODULE_FOLDER_NAME, structureHandler);
        }else if(ProcessorConstants.WIDGET_COMPONENT.equals(attributeValue)){
            doModuleProcess(context, tag, attributeName, attributeValue, ProcessorConstants.WIDGET_FOLDER_NAME, structureHandler);
        }else{
            throw new TemplateProcessingException("There is no component type: " + attributeValue);
        }

    }

    private void doModuleProcess(
            final ITemplateContext context, final IProcessableElementTag tag,
            final AttributeName attributeName, final String componentType, final String folderName,
            final IElementTagStructureHandler structureHandler) {

        final String componentName = tag.getAttributeValue("data-mug-name");
        final String componentId = tag.getAttributeValue("data-mug-id");
        final String componentSkin = tag.getAttributeValue("data-mug-skin");
        final String componentConfig = tag.getAttributeValue("data-mug-config");
        final String checkLogin = tag.getAttributeValue("data-mug-check-login");

        HttpServletRequest request = ((IWebContext)context).getRequest();
        HttpServletResponse response = ((IWebContext)context).getResponse();


        final String controlName = componentName + ProcessorConstants.CONTROL_SUFFIX;//tag.getAttributeValue("data-mug-control-name");


        //do control in component
        Map<String,Object> componentConfigMap = JsonUtil.parseJSON(componentConfig);//css 정의부 포맷으로 리턴된 string을 map으로 저장
        ComponentResultModel result = runControl(request, response, controlName, componentId, componentType, componentName, componentConfigMap);
        if(!result.isRedirect()){
            String componentPath = ProcessorUtil.getComponentPath(folderName, componentSkin, componentName, request);

            request.setAttribute("result", result.getResult());
            String skinPath = ProcessorUtil.getSkinPath(folderName, componentSkin, componentName);
            request.setAttribute("skinPath", skinPath);
            request.setAttribute("componentPath", componentPath);
            request.setAttribute("skinName", componentSkin);
            request.setAttribute("componentName", componentName);

            //clear tag attribute
            structureHandler.removeAttribute("data-mug-name");
            structureHandler.removeAttribute("data-mug-id");
            structureHandler.removeAttribute("data-mug-skin");
            structureHandler.removeAttribute("data-mug-config");

            String scene = DEFAULT_SCENE;
            if(!StringUtil.isEmpty(result.getSceneName())){
                scene = result.getSceneName();
            }
            String componentTemplatePath = componentPath + scene;
            ProcessorUtil.doProcessInsertionTag(context, tag, attributeName.getPrefix(), componentTemplatePath, structureHandler);
        }else{
            request.setAttribute("redirectUri", result.getRedirectUri());
            String templateData = ProcessorUtil.getResourceWriterString(context, ProcessorConstants.REDIRECT_TEMPLATE_PATH);
            structureHandler.replaceWith(templateData, true);
        }

    }

    /**
     * 각 콤포넌트의 control 을 호출하는 메소드
     * @param request
     * @param response
     * @param controlName
     * @param componentId
     * @param componentType
     * @param componentName
     * @return
     */
    public ComponentResultModel runControl(HttpServletRequest request, HttpServletResponse response,
                                           String controlName, String componentId, String componentType,
                                           String componentName, Map<String,Object> componentConfig) {
        AbstractComponentControl control = (AbstractComponentControl) BeanUtil.getSpringBean(controlName);
        ComponentResultModel result = new ComponentResultModel();
        if (control != null) {
            try {
                if(componentConfig == null){
                    componentConfig = new HashMap<>();
                }
                componentConfig.put(ProcessorConstants.ATTR_COMPONENT_ID, componentId);
                componentConfig.put(ProcessorConstants.ATTR_COMPONENT_TYPE, componentType);
                componentConfig.put(ProcessorConstants.ATTR_COMPONENT_NAME, componentName);
                result = control.runControl(request, response, componentConfig);
                if(control.isRedirect()){
                    result.setRedirect(true);
                    result.setRedirectUri(control.getRedirectUri());
                    control.setRedirect(false);
                    control.setRedirectUri(null);
                }
            } catch (Exception e) {
                log.error(e.getMessage(),e);
                result.setSuccess("false");
                result.setMessage(e.getMessage());
            }
        }
        return result;
    }

    private void checkLogin(HttpServletRequest request, HttpServletResponse response){
        UserVO loginUer = RequestUtil.getUserInfoInSession(request);
        if(loginUer == null){
            try {
                response.sendRedirect(CommonConstants.USER_LOGIN_URL);
            } catch (IOException e) {
                log.error(e);
                e.printStackTrace();
            }
        }
    }

}
