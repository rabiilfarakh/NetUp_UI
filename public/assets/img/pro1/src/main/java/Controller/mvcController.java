package Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class mvcController {
    @RequestMapping("/")
    public String welcome(){
        return "home";

    }
}
