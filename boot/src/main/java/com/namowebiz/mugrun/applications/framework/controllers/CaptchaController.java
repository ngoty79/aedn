package com.namowebiz.mugrun.applications.framework.controllers;

import com.namowebiz.mugrun.applications.framework.helper.SessionUtil;
import com.octo.captcha.service.multitype.MultiTypeCaptchaService;
import lombok.extern.apachecommons.CommonsLog;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;

/**
 * Created by ngo.ty on 7/6/2016.
 */
@Controller
@CommonsLog
public class CaptchaController {
    public static final String CAPTCHA_IMAGE_FORMAT = "jpeg";

    @Resource(name="captchaService")
    private MultiTypeCaptchaService captchaService;

    @RequestMapping("/captcha/captcha.do")
    public void showForm(HttpServletRequest request,
                         HttpServletResponse response) throws Exception {
        byte[] captchaChallengeAsJpeg = null;
        // the output stream to render the captcha image as jpeg into
        ByteArrayOutputStream jpegOutputStream = new ByteArrayOutputStream();
        try {
            // get the session id that will identify the generated captcha.
            // the same id must be used to validate the response, the session id
            // is a good candidate!

            //String captcharId = request.getSession().getId();
			/*
			 * 그림문자 검증값을 session id로 하지 않고 새로운 unique값을 생성한다.
			 * (session id인 경우 다중 WAS 환경에서 문제가 발생함. 2010.8.26 by jipark)
			 */
            String captcharId = SessionUtil.setUniqueValue(request, "captcharId");
            BufferedImage challenge = captchaService.getImageChallengeForID(captcharId);

            ImageIO.write(challenge, CAPTCHA_IMAGE_FORMAT, jpegOutputStream);
        } catch (IllegalArgumentException e) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            log.error(e.getMessage(),e);
            return;
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }

        captchaChallengeAsJpeg = jpegOutputStream.toByteArray();

        // flush it in the response
        response.setHeader("Cache-Control", "no-store");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);
        response.setContentType("image/" + CAPTCHA_IMAGE_FORMAT);

        ServletOutputStream responseOutputStream = response.getOutputStream();
        responseOutputStream.write(captchaChallengeAsJpeg);
        responseOutputStream.flush();
        responseOutputStream.close();
    }
}


