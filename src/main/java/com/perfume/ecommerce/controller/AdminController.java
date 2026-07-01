package com.perfume.ecommerce.controller;

import com.perfume.ecommerce.dto.GraphQLRequest;
import com.perfume.ecommerce.dto.HeaderResponse;
import com.perfume.ecommerce.dto.order.OrderResponse;
import com.perfume.ecommerce.dto.order.UpdateOrderStatusRequest;
import com.perfume.ecommerce.dto.perfume.PerfumeRequest;
import com.perfume.ecommerce.dto.perfume.FullPerfumeResponse;
import com.perfume.ecommerce.dto.user.BaseUserResponse;
import com.perfume.ecommerce.dto.user.UserResponse;
import com.perfume.ecommerce.mapper.OrderMapper;
import com.perfume.ecommerce.mapper.PerfumeMapper;
import com.perfume.ecommerce.mapper.UserMapper;
import com.perfume.ecommerce.security.UserPrincipal;
import com.perfume.ecommerce.service.graphql.GraphQLProvider;
import com.perfume.ecommerce.service.DashboardService;
import graphql.ExecutionResult;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

import static com.perfume.ecommerce.constants.PathConstants.*;

@RestController
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
@RequestMapping(API_V1_ADMIN)
public class AdminController {

    private final UserMapper userMapper;
    private final PerfumeMapper perfumeMapper;
    private final OrderMapper orderMapper;
    private final GraphQLProvider graphQLProvider;
    private final DashboardService dashboardService;

    @PostMapping(ADD)
    public ResponseEntity<FullPerfumeResponse> addPerfume(@RequestPart(name = "file", required = false) MultipartFile file,
                                                          @RequestPart("perfume") @Valid PerfumeRequest perfume,
                                                          BindingResult bindingResult) {
        return ResponseEntity.ok(perfumeMapper.savePerfume(perfume, file, bindingResult));
    }

    @PostMapping(EDIT)
    public ResponseEntity<FullPerfumeResponse> updatePerfume(@RequestPart(name = "file", required = false) MultipartFile file,
                                                             @RequestPart("perfume") @Valid PerfumeRequest perfume,
                                                             BindingResult bindingResult) {
        return ResponseEntity.ok(perfumeMapper.savePerfume(perfume, file, bindingResult));
    }

    @DeleteMapping(DELETE_BY_PERFUME_ID)
    public ResponseEntity<String> deletePerfume(@PathVariable Long perfumeId) {
        return ResponseEntity.ok(perfumeMapper.deletePerfume(perfumeId));
    }

    @GetMapping(ORDERS)
    public ResponseEntity<List<OrderResponse>> getAllOrders(@PageableDefault(size = 10) Pageable pageable) {
        HeaderResponse<OrderResponse> response = orderMapper.getAllOrders(pageable);
        return ResponseEntity.ok().headers(response.getHeaders()).body(response.getItems());
    }

    @GetMapping(ORDER_BY_EMAIL)
    public ResponseEntity<List<OrderResponse>> getUserOrdersByEmail(@PathVariable String userEmail,
                                                                    @PageableDefault(size = 10) Pageable pageable) {
        HeaderResponse<OrderResponse> response = orderMapper.getUserOrders(userEmail, pageable);
        return ResponseEntity.ok().headers(response.getHeaders()).body(response.getItems());
    }

    @PutMapping(ORDER + ORDER_ID_STATUS)
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long orderId,
                                                           @Valid @RequestBody UpdateOrderStatusRequest request,
                                                           BindingResult bindingResult,
                                                           @AuthenticationPrincipal UserPrincipal adminUser) {
        Long adminId = adminUser != null ? adminUser.getId() : null;
        return ResponseEntity.ok(orderMapper.updateOrderStatus(orderId, request, adminId));
    }

    @DeleteMapping(ORDER_DELETE)
    public ResponseEntity<String> deleteOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderMapper.deleteOrder(orderId));
    }

    @GetMapping(USER_BY_ID)
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(userMapper.getUserById(userId));
    }

    @GetMapping(USER_ALL)
    public ResponseEntity<List<BaseUserResponse>> getAllUsers(@PageableDefault(size = 10) Pageable pageable) {
        HeaderResponse<BaseUserResponse> response = userMapper.getAllUsers(pageable);
        return ResponseEntity.ok().headers(response.getHeaders()).body(response.getItems());
    }

    @PostMapping(GRAPHQL_USER)
    public ResponseEntity<ExecutionResult> getUserByQuery(@RequestBody GraphQLRequest request) {
        return ResponseEntity.ok(graphQLProvider.getGraphQL().execute(request.getQuery()));
    }

    @PostMapping(GRAPHQL_USER_ALL)
    public ResponseEntity<ExecutionResult> getAllUsersByQuery(@RequestBody GraphQLRequest request) {
        return ResponseEntity.ok(graphQLProvider.getGraphQL().execute(request.getQuery()));
    }

    @PostMapping(GRAPHQL_ORDERS)
    public ResponseEntity<ExecutionResult> getAllOrdersQuery(@RequestBody GraphQLRequest request) {
        return ResponseEntity.ok(graphQLProvider.getGraphQL().execute(request.getQuery()));
    }

    @PostMapping(GRAPHQL_ORDER)
    public ResponseEntity<ExecutionResult> getUserOrdersByEmailQuery(@RequestBody GraphQLRequest request) {
        return ResponseEntity.ok(graphQLProvider.getGraphQL().execute(request.getQuery()));
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        return ResponseEntity.ok(dashboardService.getStatistics());
    }

    @PostMapping("/email/promotional")
    public ResponseEntity<String> sendPromotionalEmail(@RequestBody Map<String, String> request) {
        dashboardService.sendPromotionalEmail(request.get("subject"), request.get("message"));
        return ResponseEntity.ok("Emails sent successfully");
    }
}
