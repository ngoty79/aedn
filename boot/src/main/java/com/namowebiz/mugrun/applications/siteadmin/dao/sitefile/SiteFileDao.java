package com.namowebiz.mugrun.applications.siteadmin.dao.sitefile;

import com.namowebiz.mugrun.applications.siteadmin.models.sitefile.SiteFile;
import com.namowebiz.mugrun.applications.siteadmin.models.sitefile.SiteFileVO;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * 파일에 대한 정보를 가져오는 DAO 클래스이다.
 *
 */
@Repository
public interface SiteFileDao {
	
	/**
	 * 파일정보 생성
	 * @param model 파일정보
	 * @return 생성 파일번호
	 * @throws Exception
	 */
	public void addFile(SiteFile model);
	
	/**
	 * 파일정보 삭제
	 * @param fileNo 파일번호
	 * @throws Exception
	 */
	public void deleteFile(Long fileNo);
	
	/**
	 * 해당 모듈의 파일정보 삭제
	 * @param vo 삭제조건(모듈명,파일path)
	 * @throws Exception
	 */
	public void deleteFileOfModule(SiteFileVO vo);
	
	/**
	 * 파일정보 조회
	 * @param fileNo 파일번호
	 * @return 파일정보
	 * @throws Exception
	 */
	public SiteFile getSiteFile(Long fileNo);
	
	/**
	 * 파일정보 리스트 조회
	 * @param param
	 * @return 파일정보 리스트
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public List<SiteFile> getSiteFiles(Map<String, Object> param);

	/**
	 * 해당 모듈의 모든 파일정보 변경
	 * @param vo 파일 변경정보
	 * @throws Exception
	 */
	public void modifyFileOfAllModule(SiteFileVO vo);
	
	/**
	 * 해당 모듈의 파일정보 변경
	 * @param vo 파일 변경정보(파일path,신규파일path)
	 * @throws Exception
	 */
	public void modifyFileOfModule(SiteFileVO vo);
	
	/**
	 * 해당 모듈에서 등록한 파일정보 리스트 조회
	 * @param vo 조회조건(모듈명(tableId),모듈Key)
	 * @return 파일정보 리스트
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public List<SiteFile> getSiteFileListOfModule(SiteFileVO vo);
	
	/**
	 * 파일삭제사유를 입력/수정 한다.
	 * 
	 * @param form
	 * @throws Exception
	 */
	public void submitFileDeleteReason(SiteFile form);
	
	/**
	 * 업로드 제한 확장자 목록을 가져온다.
	 * 
	 * @return bannedFileExtentions
	 * @throws Exception
	 */
	public String getBannedFileExtentions();
	
	/**
	 * 사이트에서 현재 사용중인 모든 파일의 용량 합계를 구해 반환함 
	 * @param siteId
	 * @return
	 * @throws Exception
	 */
	public Long getSiteTotalFileUsage(String siteId);
	
	/**
	 * 유효기간 지난 파일목록 반환
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	public List<SiteFile> getOverdueFileList(Map<String, Object> paramMap);
	
	/**
	 * 유효기간 지난 파일 제거
	 * @param paramMap
	 * @throws Exception
	 */
	public void updateOverdueFileFlag(Map<String, Object> paramMap);

	SiteFile getFirstBoardFile(Long boardContentNo);

	SiteFile getFirstBoardImageFile(Long boardContentNo);
}