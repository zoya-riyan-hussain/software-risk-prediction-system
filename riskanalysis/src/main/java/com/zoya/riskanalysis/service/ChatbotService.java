package com.zoya.riskanalysis.service;

import com.zoya.riskanalysis.dto.ChatResponseDto;

public interface ChatbotService {
    ChatResponseDto askQuestion(String message);
}