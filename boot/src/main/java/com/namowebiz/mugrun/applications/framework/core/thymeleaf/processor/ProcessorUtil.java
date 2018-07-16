package com.namowebiz.mugrun.applications.framework.core.thymeleaf.processor;

import jodd.util.StringUtil;
import org.thymeleaf.IEngineConfiguration;
import org.thymeleaf.context.IEngineContext;
import org.thymeleaf.context.ITemplateContext;
import org.thymeleaf.engine.TemplateData;
import org.thymeleaf.engine.TemplateModel;
import org.thymeleaf.exceptions.TemplateInputException;
import org.thymeleaf.exceptions.TemplateProcessingException;
import org.thymeleaf.model.*;
import org.thymeleaf.processor.element.IElementTagStructureHandler;
import org.thymeleaf.standard.expression.*;
import org.thymeleaf.util.EscapedAttributeUtils;
import org.thymeleaf.util.FastStringWriter;
import org.thymeleaf.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.Writer;
import java.util.Map;

/**
 * Created by ngo.ty on 7/20/2016.
 */
public class ProcessorUtil {
    private static final String FRAGMENT_ATTR_NAME = "fragment";
    private static final boolean replaceHost = true;
    // This flag should probably be removed once th:include is removed in 3.2 (deprecated in 3.0)
    private static final boolean insertOnlyContents = false;

    public static String getComponentPath(final String folderName, final String skinName,
                                    String componentName, HttpServletRequest request){
        String componentTemplatePath = "components/" + folderName + "/" + componentName + "/";
        if(!StringUtil.isBlank(skinName)){
            componentTemplatePath += skinName + "/";
        }
        return componentTemplatePath;
    }

    public static String getSkinPath(final String folderName, final String skinName, String componentName){
        String skinPath = "/assets/components/" + folderName + "/" + componentName + "/";
        if(!StringUtil.isBlank(skinName)){
            skinPath += skinName + "/";
        }

        return skinPath;
    }

    public static String getResourceWriterString(final ITemplateContext context,
                                             final String attributeValue) {

        if (StringUtils.isEmptyOrWhitespace(attributeValue)) {
            throw new TemplateProcessingException("Fragment specifications cannot be empty");
        }

        final IEngineConfiguration configuration = context.getConfiguration();
        final Object fragmentObj = computeFragment(context, attributeValue);
        if (fragmentObj == null) {
            throw new TemplateInputException(
                    "Error resolving fragment: \"" + attributeValue + "\": " +
                            "template or fragment could not be resolved");

        }

        final Fragment fragment = (Fragment) fragmentObj;


        final Writer stringWriter = new FastStringWriter(200);
        final TemplateModel fragmentModel = fragment.getTemplateModel();
        configuration.getTemplateManager().process(fragmentModel, context, stringWriter);

        return stringWriter.toString();

    }

    public static void doProcessInsertionTag(final ITemplateContext context,
                                         final IProcessableElementTag tag,
                                         final String dialectPrefix,
                                         final String attributeValue,
                                         final IElementTagStructureHandler structureHandler) {
        if (StringUtils.isEmptyOrWhitespace(attributeValue)) {
            throw new TemplateProcessingException("Fragment specifications cannot be empty");
        }

        final IEngineConfiguration configuration = context.getConfiguration();
        final Object fragmentObj = computeFragment(context, attributeValue);
        if (fragmentObj == null) {
            throw new TemplateInputException(
                    "Error resolving fragment: \"" + attributeValue + "\": " +
                            "template or fragment could not be resolved");

        } else if (fragmentObj == NoOpToken.VALUE) {
            return;
        } else if (fragmentObj == Fragment.EMPTY_FRAGMENT) {
            if (replaceHost) {
                structureHandler.removeElement();
            } else {
                structureHandler.removeBody();
            }
            return;
        }

        final Fragment fragment = (Fragment) fragmentObj;


        final TemplateModel fragmentModel = fragment.getTemplateModel();
        Map<String, Object> fragmentParameters = fragment.getParameters();

        final ITemplateEvent firstEvent = (fragmentModel.size() > 2 ? fragmentModel.get(1) : null);
        if (firstEvent != null && IProcessableElementTag.class.isAssignableFrom(firstEvent.getClass())) {

//            final String dialectPrefix = attributeName.getPrefix();
            final IProcessableElementTag fragmentHolderEvent = (IProcessableElementTag) firstEvent;

            if (fragmentHolderEvent.hasAttribute(dialectPrefix, FRAGMENT_ATTR_NAME)) {

                final String fragmentSignatureSpec =
                        EscapedAttributeUtils.unescapeAttribute(fragmentModel.getTemplateMode(), fragmentHolderEvent.getAttributeValue(dialectPrefix, FRAGMENT_ATTR_NAME));
                if (!StringUtils.isEmptyOrWhitespace(fragmentSignatureSpec)) {

                    final FragmentSignature fragmentSignature =
                            FragmentSignatureUtils.parseFragmentSignature(configuration, fragmentSignatureSpec);
                    if (fragmentSignature != null) {
                        fragmentParameters = FragmentSignatureUtils.processParameters(fragmentSignature, fragmentParameters, fragment.hasSyntheticParameters());
                    }
                }
            }

        }

        if (context.getTemplateMode() != fragmentModel.getTemplateMode()) {
            if (insertOnlyContents) {
                throw new TemplateProcessingException(
                        "Template being processed uses template mode " + context.getTemplateMode() + ", " +
                                "inserted fragment \"" + attributeValue + "\" uses template mode " +
                                fragmentModel.getTemplateMode() + ". Cross-template-mode fragment insertion is not " +
                                "allowed using the " + dialectPrefix + " attribute, which is considered deprecated as " +
                                "of Thymeleaf 3.0. Use {th:insert,data-th-insert} or {th:replace,data-th-replace} " +
                                "instead, which do not remove the container element from the fragment being inserted.");
            }

            if (fragmentParameters != null && fragmentParameters.size() > 0) {

                if (!(context instanceof IEngineContext)) {
                    throw new TemplateProcessingException(
                            "Parameterized fragment insertion is not supported because local variable support is DISABLED. This is due to " +
                                    "the use of an implementation of the " + ITemplateContext.class.getName() + " interface that does " +
                                    "not provide local-variable support. In order to have local-variable support, the variables map " +
                                    "implementation should also implement the " + IEngineContext.class.getName() +
                                    " interface");
                }
                ((IEngineContext) context).setVariables(fragmentParameters);

            }
            final Writer stringWriter = new FastStringWriter(200);
            configuration.getTemplateManager().process(fragmentModel, context, stringWriter);

            // We will insert the result as NON-PROCESSABLE text (it's already been processed!)
            if (replaceHost) {
                structureHandler.replaceWith(stringWriter.toString(), false);
            } else {
                structureHandler.setBody(stringWriter.toString(), false);
            }

            return;

        }
        final TemplateData fragmentTemplateData = fragmentModel.getTemplateData();
        structureHandler.setTemplateData(fragmentTemplateData);

        if (fragmentParameters != null && fragmentParameters.size() > 0) {
            for (final Map.Entry<String,Object> fragmentParameterEntry : fragmentParameters.entrySet()) {
                structureHandler.setLocalVariable(fragmentParameterEntry.getKey(), fragmentParameterEntry.getValue());
            }
        }


        if (insertOnlyContents && fragmentTemplateData.hasTemplateSelectors()) {
            final IModel model = fragmentModel.cloneModel();
            int modelLevel = 0;
            int n = model.size();
            while (n-- != 0) { // We traverse backwards so that we can modify at the same time

                final ITemplateEvent event = model.get(n);

                if (event instanceof ICloseElementTag) {
                    if (((ICloseElementTag) event).isUnmatched()) {
                        // This is an unmatched close tag (no corresponding open), therefore should not affect our count
                        continue;
                    }
                    if (modelLevel <= 0) {
                        model.remove(n);
                    }
                    modelLevel++;
                    continue;
                }
                if (event instanceof IOpenElementTag) {
                    modelLevel--;
                    if (modelLevel <= 0) {
                        model.remove(n);
                    }
                    continue;
                }
                if (modelLevel <= 0) {
                    model.remove(n);
                }

            }

            if (replaceHost) {
                structureHandler.replaceWith(model, true);
            } else {
                structureHandler.setBody(model, true);
            }

            return;

        }


        if (replaceHost) {
            structureHandler.replaceWith(fragmentModel, true);
        } else {
            structureHandler.setBody(fragmentModel, true);
        }

    }

    /*
     * This can return a Fragment, NoOpToken (if nothing should be done) or null
     */
    private static Object computeFragment(final ITemplateContext context, final String input) {

        final IStandardExpressionParser expressionParser = StandardExpressions.getExpressionParser(context.getConfiguration());

        final String trimmedInput = input.trim();

        if (shouldBeWrappedAsFragmentExpression(trimmedInput)) {
            final FragmentExpression fragmentExpression =
                    (FragmentExpression) expressionParser.parseExpression(context, "~{" + trimmedInput + "}");

            final FragmentExpression.ExecutedFragmentExpression executedFragmentExpression =
                    FragmentExpression.createExecutedFragmentExpression(context, fragmentExpression, StandardExpressionExecutionContext.NORMAL);

            if (executedFragmentExpression.getFragmentSelectorExpressionResult() == null && executedFragmentExpression.getFragmentParameters() == null) {
                final Object templateNameExpressionResult = executedFragmentExpression.getTemplateNameExpressionResult();
                if (templateNameExpressionResult != null) {
                    if (templateNameExpressionResult instanceof Fragment) {
                        return templateNameExpressionResult;
                    }
                    if (templateNameExpressionResult == NoOpToken.VALUE) {
                        return NoOpToken.VALUE;
                    }
                }
            }
            return FragmentExpression.resolveExecutedFragmentExpression(context, executedFragmentExpression, true);

        }


        final IStandardExpression fragmentExpression = expressionParser.parseExpression(context, trimmedInput);

        final Object fragmentExpressionResult;

        if (fragmentExpression != null && fragmentExpression instanceof FragmentExpression) {
            final FragmentExpression.ExecutedFragmentExpression executedFragmentExpression =
                    FragmentExpression.createExecutedFragmentExpression(context, (FragmentExpression) fragmentExpression, StandardExpressionExecutionContext.NORMAL);

            fragmentExpressionResult =
                    FragmentExpression.resolveExecutedFragmentExpression(context, executedFragmentExpression, true);

        } else {

            fragmentExpressionResult = fragmentExpression.execute(context);

        }

        if (fragmentExpressionResult == null || fragmentExpressionResult == NoOpToken.VALUE) {
            return fragmentExpressionResult;
        }

        if (!(fragmentExpressionResult instanceof Fragment)) {
            throw new TemplateProcessingException(
                    "Invalid fragment specification: \"" + input + "\": " +
                            "expression does not return a Fragment object");
        }

        return fragmentExpressionResult;

    }



    static boolean shouldBeWrappedAsFragmentExpression(final String input) {
        final int inputLen = input.length();
        if (inputLen > 2 && input.charAt(0) == FragmentExpression.SELECTOR && input.charAt(1) == '{') {
            return false;
        }
        char c;
        int bracketLevel = 0;
        int paramLevel = 0;
        boolean inLiteral = false;
        int n = inputLen;
        int i = 0;
        while (n-- != 0) {

            c = input.charAt(i);

            if ((c >= 'a' && c <= 'z') || c == ' ') {
                // Fail fast - most characters will fall here
                i++;
                continue;
            }

            if (c == '\'') {
                inLiteral = !inLiteral;
            } else if (!inLiteral) {
                if (c == '{') {
                    bracketLevel++;
                } else if (c == '}') {
                    bracketLevel--;
                } else if (bracketLevel == 0) {
                    if (c == '(') {
                        paramLevel++;
                    } else if (c == ')') {
                        paramLevel--;
                    } else if (c == '=' && paramLevel == 1) {
                        return true;
                    } else if (c == FragmentExpression.SELECTOR && n != 0 && input.charAt(i + 1) == '{') {
                        return false;
                    } else if (c == ':' && n != 0 && input.charAt(i + 1) == ':') {
                        return true;
                    }
                }
            }

            i++;

        }
        return true;

    }
}
