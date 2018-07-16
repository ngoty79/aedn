package com.namowebiz.mugrun.applications.framework.core.thymeleaf.dialect;

import com.namowebiz.mugrun.applications.framework.core.thymeleaf.processor.ComponentControlProcessor;
import com.namowebiz.mugrun.applications.framework.core.thymeleaf.processor.ComponentResourceProcessor;
import org.thymeleaf.dialect.AbstractProcessorDialect;
import org.thymeleaf.processor.IProcessor;
import org.thymeleaf.standard.StandardDialect;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by ngo.ty on 6/23/2016.
 */
public class MugrunDialect extends AbstractProcessorDialect {
    public static final String DIALECT_PREFIX = "mug";
    private static final String DIALECT_NAME = "Mugrun Component Dialect";

    public MugrunDialect() {
        super(DIALECT_NAME, DIALECT_PREFIX, StandardDialect.PROCESSOR_PRECEDENCE);
    }

    /*
     * Two attribute processors are declared: 'classforposition' and
     * 'remarkforposition'. Also one element processor: the 'headlines'
     * tag.
     */
    public Set<IProcessor> getProcessors(final String dialectPrefix) {
        final Set<IProcessor> processors = new HashSet<IProcessor>();
        processors.add(new ComponentControlProcessor(dialectPrefix));
        processors.add(new ComponentResourceProcessor(dialectPrefix));
        return processors;
    }


}
