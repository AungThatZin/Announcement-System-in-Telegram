package com.announce.AcknowledgeHub_SpringBoot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.web.multipart.MultipartFile;

import java.util.Objects;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmailWithAttachment(String to, String subject, String text, byte[] fileBytes, String fileName) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text);

        // Attach the file if available
        if (fileBytes != null && fileName != null) {
            helper.addAttachment(fileName, new ByteArrayResource(fileBytes));
        }

        mailSender.send(message);
    }
    public void sendAccountLockWarning(String toEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Account Locked Due to Multiple Failed Login Attempts");
        message.setText("Your account has been locked due to multiple failed login attempts. Please wait for 2 minutes and try again.");
        mailSender.send(message);
    }
}
