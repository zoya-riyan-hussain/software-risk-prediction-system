package com.zoya.riskanalysis.controller;

import com.zoya.riskanalysis.dto.ChatRequestDto;
import com.zoya.riskanalysis.dto.ChatResponseDto;
import com.zoya.riskanalysis.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/ask")
    public ChatResponseDto askQuestion(@RequestBody ChatRequestDto dto) {
        return chatbotService.askQuestion(dto.getMessage());
    }
}