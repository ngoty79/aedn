package com.namowebiz.mugrun.applications.framework.core.thymeleaf.processor;

import com.namowebiz.mugrun.applications.framework.common.utils.JsonUtil;
import com.namowebiz.mugrun.applications.framework.helper.BeanUtil;
import com.namowebiz.mugrun.applications.framework.helper.StringUtil;
import com.namowebiz.mugrun.applications.framework.services.component.control.AbstractComponentControl;
import org.springframework.context.ApplicationContext;
import org.thymeleaf.context.ITemplateContext;
import org.thymeleaf.context.IWebContext;
import org.thymeleaf.model.IProcessableElementTag;
import org.thymeleaf.processor.element.AbstractElementTagProcessor;
import org.thymeleaf.processor.element.IElementTagStructureHandler;
import org.thymeleaf.spring4.context.SpringContextUtils;
import org.thymeleaf.templatemode.TemplateMode;

import javax.servlet.http.HttpServletRequest;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by ngo.ty on 7/20/2016.
 */
public class ComponentResourceProcessor extends AbstractElementTagProcessor {

    private static final String TAG_NAME = "resources";
    private static final int PRECEDENCE = 1000;
    private String dialectPrefix = null;
    public ComponentResourceProcessor(final String dialectPrefix) {

        super(
                TemplateMode.HTML, // This processor will apply only to HTML mode
                dialectPrefix,     // Prefix to be applied to name for matching
                TAG_NAME,          // Tag name: match specifically this tag
                true,              // Apply dialect prefix to tag name
                null,              // No attribute name: will match by tag name
                false,             // No prefix to be applied to attribute name
                PRECEDENCE);       // Precedence (inside dialect's own precedence)

        this.dialectPrefix = dialectPrefix;
    }

    @Override
    protected void doProcess(
            final ITemplateContext context, final IProcessableElementTag tag,
            final IElementTagStructureHandler structureHandler) {

        /*
         * Obtain the Spring application context.
         */

        final ApplicationContext appCtx = SpringContextUtils.getApplicationContext(context);
        HttpServletRequest request = ((IWebContext)context).getRequest();

        String resourceConfig = tag.getAttributeValue("data-mug-config");
        List<Map<String, String>> componentConfigList = JsonUtil.parseJSON(resourceConfig, List.class);
        StringBuffer data = new StringBuffer();
        if(componentConfigList != null && !componentConfigList.isEmpty()){
            for (Map<String, String> configMap : componentConfigList) {
                String componentType = configMap.get("type");
                String componentName = configMap.get("name");
                String componentSkin = configMap.get("skin");
                String controlName = componentName + ProcessorConstants.CONTROL_SUFFIX;
                String scene = getSceneName(request, controlName);

                String folderName = ProcessorConstants.MODULE_FOLDER_NAME;
                if(ProcessorConstants.WIDGET_COMPONENT.equals(componentType)){
                    folderName = ProcessorConstants.WIDGET_FOLDER_NAME;
                }
                String skinPath = ProcessorUtil.getSkinPath(folderName, componentSkin, componentName);
                request.setAttribute("skinPath", skinPath);
                request.setAttribute("scene", scene);
                String componentPath = ProcessorUtil.getComponentPath(folderName, null, componentName, request);
                String componentResourcePath = componentPath + ProcessorConstants.RESOURCES_TEMPLATE_NAME;
                String templateData = ProcessorUtil.getResourceWriterString(context, componentResourcePath);
                data.append(templateData + "\n");
            }

            structureHandler.replaceWith(buildAsset(data.toString()), true);
        }
    }

    private String buildAsset(String data){
        Set<String> assets = new HashSet<>();
        String[] lines = data.split("\n");
        for (String line : lines) {
            if(!StringUtil.isEmpty(line.trim())){
                assets.add(line.trim());
            }
        }
        StringBuffer assetString = new StringBuffer();
        for (String assetLine : assets) {
            assetString.append(assetLine + "\n");
        }
        return assetString.toString();
    }

    private String getSceneName(HttpServletRequest request, String controlName){
        AbstractComponentControl control = (AbstractComponentControl) BeanUtil.getSpringBean(controlName);
        if (control != null) {
            return control.getScene(request);
        }
        return AbstractComponentControl.DEFAULT_SCENE_NAME;

    }
}
