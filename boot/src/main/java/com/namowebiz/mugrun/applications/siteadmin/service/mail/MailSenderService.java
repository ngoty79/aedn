package com.namowebiz.mugrun.applications.siteadmin.service.mail;

import lombok.extern.apachecommons.CommonsLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

/**
 * Created by jipark on 7/23/2016.
 */
@Service
@CommonsLog
public class MailSenderService {

    @Autowired
    private JavaMailSenderImpl javaMailSender;

    public void send(String fromEmail, String fromName, String toEmail, String userName, String subject, String htmlContent){
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage);
            helper.setFrom(new InternetAddress(fromEmail, fromName, "UTF-8"));
            helper.setTo(new InternetAddress(toEmail, userName, "UTF-8"));
            helper.setText(htmlContent, true);
            helper.setSubject(subject);
            javaMailSender.send(mimeMessage);
        } catch (Exception e) {
            log.error(e.getMessage(),e);
        }
    }
}
