package com.namowebiz.mugrun.applications.framework.services.authentication.strategies;


import org.springframework.session.Session;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.CookieSerializer.CookieValue;
import org.springframework.session.web.http.DefaultCookieSerializer;
import org.springframework.session.web.http.HttpSessionManager;
import org.springframework.session.web.http.MultiHttpSessionStrategy;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;
import java.util.*;
import java.util.Map.Entry;

@Component
public final class CookieHttpSessionStrategy implements MultiHttpSessionStrategy, HttpSessionManager {
    private static final String SESSION_IDS_WRITTEN_ATTR = CookieHttpSessionStrategy.class.getName().concat(".SESSIONS_WRITTEN_ATTR");
    private CookieSerializer cookieSerializer = new DefaultCookieSerializer();

    public CookieHttpSessionStrategy() {
    }

    public String encodeURL(String url, String sessionAlias) {
        return url;
    }

    public String getCurrentSessionAlias(HttpServletRequest request) {
        return sessionCondition(request);
    }

    public String getNewSessionAlias(HttpServletRequest request) {
        return sessionCondition(request);
    }

    public String getRequestedSessionId(HttpServletRequest request) {
        Map sessionIds = this.getSessionIds(request);
        String sessionAlias = this.getCurrentSessionAlias(request);
        return (String) sessionIds.get(sessionAlias);
    }

    public Map<String, String> getSessionIds(HttpServletRequest request) {
        List cookieValues = this.cookieSerializer.readCookieValues(request);
        String sessionCookieValue = cookieValues.isEmpty() ? "" : (String) cookieValues.iterator().next();
        LinkedHashMap result = new LinkedHashMap();
        StringTokenizer tokens = new StringTokenizer(sessionCookieValue, " ");

        while (tokens.hasMoreTokens()) {
            String alias = tokens.nextToken();
            if (!tokens.hasMoreTokens()) {
                break;
            }

            String id = tokens.nextToken();
            result.put(alias, id);
        }

        return result;
    }

    public void onInvalidateSession(HttpServletRequest request, HttpServletResponse response) {
        Map sessionIds = this.getSessionIds(request);
        String requestedAlias = this.getCurrentSessionAlias(request);
        sessionIds.remove(requestedAlias);
        String cookieValue = this.createSessionCookieValue(sessionIds);
        this.cookieSerializer.writeCookieValue(new CookieValue(request, response, cookieValue));
    }

    public void onNewSession(Session session, HttpServletRequest request, HttpServletResponse response) {
        Set sessionIdsWritten = this.getSessionIdsWritten(request);
        if (!sessionIdsWritten.contains(session.getId())) {
            sessionIdsWritten.add(session.getId());
            Map sessionIds = this.getSessionIds(request);
            String sessionAlias = this.getCurrentSessionAlias(request);
            sessionIds.put(sessionAlias, session.getId());
            String cookieValue = this.createSessionCookieValue(sessionIds);
            this.cookieSerializer.writeCookieValue(new CookieValue(request, response, cookieValue));
        }
    }

    /**
     * @deprecated
     */
    @Deprecated
    public void setCookieName(String cookieName) {
        DefaultCookieSerializer serializer = new DefaultCookieSerializer();
        serializer.setCookieName(cookieName);
        this.cookieSerializer = serializer;
    }

    public void setCookieSerializer(CookieSerializer cookieSerializer) {
        Assert.notNull(cookieSerializer, "cookieSerializer cannot be null");
        this.cookieSerializer = cookieSerializer;
    }

    public HttpServletRequest wrapRequest(HttpServletRequest request, HttpServletResponse response) {
        request.setAttribute(HttpSessionManager.class.getName(), this);
        return request;
    }

    public HttpServletResponse wrapResponse(HttpServletRequest request, HttpServletResponse response) {
        return new CookieHttpSessionStrategy.MultiSessionHttpServletResponse(response, request);
    }

    private String createSessionCookieValue(Map<String, String> sessionIds) {
        if (sessionIds.isEmpty()) {
            return "";
        } else {
            StringBuffer buffer = new StringBuffer();
            Iterator i$ = sessionIds.entrySet().iterator();

            while (i$.hasNext()) {
                Entry entry = (Entry) i$.next();
                String alias = (String) entry.getKey();
                String id = (String) entry.getValue();
                buffer.append(alias);
                buffer.append(" ");
                buffer.append(id);
                buffer.append(" ");
            }

            buffer.deleteCharAt(buffer.length() - 1);
            return buffer.toString();
        }
    }

    private Set<String> getSessionIdsWritten(HttpServletRequest request) {
        Object sessionsWritten = (Set) request.getAttribute(SESSION_IDS_WRITTEN_ATTR);
        if (sessionsWritten == null) {
            sessionsWritten = new HashSet();
            request.setAttribute(SESSION_IDS_WRITTEN_ATTR, sessionsWritten);
        }

        return (Set) sessionsWritten;
    }

    private String sessionCondition(HttpServletRequest request) {
        boolean result = request.getRequestURI().startsWith("/admin");
        return result ? "0" : "1";
    }

    class MultiSessionHttpServletResponse extends HttpServletResponseWrapper {
        private final HttpServletRequest request;

        public MultiSessionHttpServletResponse(HttpServletResponse response, HttpServletRequest request) {
            super(response);
            this.request = request;
        }

        public String encodeRedirectURL(String url) {
            return CookieHttpSessionStrategy.this.encodeURL(super.encodeRedirectURL(url), CookieHttpSessionStrategy.this.getCurrentSessionAlias(this.request));
        }

        public String encodeURL(String url) {
            String alias = CookieHttpSessionStrategy.this.getCurrentSessionAlias(this.request);
            return CookieHttpSessionStrategy.this.encodeURL(super.encodeURL(url), alias);
        }
    }
}