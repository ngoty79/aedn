package com.namowebiz.mugrun.applications.framework.helper;

import com.namowebiz.mugrun.applications.framework.facades.Application;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.ServletContext;

@CommonsLog
public class BeanUtil {

	/**
	 * 특정 명칭의 spring bean 을 반환함.
	 * @param beanName
	 * @return
	 */
	public static Object getSpringBean(String beanName) {
		
		//if ("genericWidgetHandler".equals(beanName)) return null;
		
		ServletContext servletContext = Application.getServletContext();
		WebApplicationContext wac = WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext);
		try {
			return wac.getBean(beanName);
		} catch(Exception e) {
            log.error(e);
            return null;
		}

	}

    /**
     * get spring bean when compare in lower case , used in theme functions
     * @return
     */
    public static String getControlBeanNameWithLowerCase(String lowercase){
        try {
            ServletContext servletContext = Application.getServletContext();
            WebApplicationContext wac = WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext);
            String[] names = wac.getBeanDefinitionNames();
            for (String name : names) {
                String oldBeanName = name;
                name = name.toLowerCase();
                if (name.contains(lowercase) && name.endsWith("control")) {
                    return oldBeanName;
                }

            }
        } catch (Exception e) {
            log.error(e);
        }
        return null;

    }
	
	/**
	 * 네이밍 규칙에 맞도록 선언된 컴포넌트 핸들러 bean 반환
	 * 규칙 : (widgetId)(widgetType)Handler
	 * ex) 	boardModuleHandler
	 * 		counterWidgetHandler
	 * 		bannerModuleHandler
	 * 		...
	 * @param widgetType
	 * @param widgetId
	 * @return
	 */
	public static Object getComponentHandler(String widgetType, String widgetId) {
		
		
		StringBuilder sb = new StringBuilder()
			.append(widgetId.toLowerCase())
			.append(StringUtil.getFirstUpperStr(widgetType))
			.append("Handler");
		
		return getSpringBean(sb.toString());
		
	}
}
