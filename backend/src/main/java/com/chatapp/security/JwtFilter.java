package com.chatapp.security;
import jakarta.servlet.*;import jakarta.servlet.http.*;import lombok.RequiredArgsConstructor;import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;import org.springframework.security.core.context.SecurityContextHolder;import org.springframework.stereotype.Component;import org.springframework.web.filter.OncePerRequestFilter;import java.io.IOException;import java.util.Collections;
@Component @RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter{
 private final JwtUtil jwtUtil;
 protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,IOException{
  String h=req.getHeader("Authorization");
  if(h!=null&&h.startsWith("Bearer ")){String t=h.substring(7); if(jwtUtil.validate(t)){String email=jwtUtil.extractEmail(t); SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(email,null,Collections.emptyList()));}}
  chain.doFilter(req,res);
 }
}
